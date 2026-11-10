package com.finsight.backend.service;

import com.finsight.backend.dto.*;
import com.finsight.backend.exception.ResourceNotFoundException;
import com.finsight.backend.exception.UnauthorizedException;
import com.finsight.backend.model.Transaction;
import com.finsight.backend.model.User;
import com.finsight.backend.repository.TransactionRepository;
import com.finsight.backend.repository.UserRepository;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private static final Logger log = LoggerFactory.getLogger(TransactionService.class);

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final MlClientService mlClientService;

    public TransactionService(TransactionRepository transactionRepository,
            UserRepository userRepository,
            MlClientService mlClientService) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.mlClientService = mlClientService;
    }

    public TransactionResponse createTransaction(Long userId, TransactionRequest request) {
        User user = getUser(userId);
        Transaction tx = new Transaction();
        tx.setUser(user);
        tx.setMerchant(request.getMerchant());
        tx.setDescription(request.getDescription());
        tx.setAmount(request.getAmount());
        tx.setTransactionDate(request.getTransactionDate());
        tx.setPaymentMethod(request.getPaymentMethod());

        // ML category prediction if not provided
        String category = request.getCategory();
        if (category == null || category.isBlank()) {
            MlCategoryResponse catResponse = mlClientService.predictCategory(
                    request.getMerchant(), request.getDescription());
            category = catResponse.getCategory();
            tx.setMlCategoryConfidence(catResponse.getConfidence());
        }
        tx.setCategory(category);

        // Anomaly detection
        MlAnomalyResponse anomaly = mlClientService.detectAnomaly(
                request.getAmount().doubleValue(), category, request.getMerchant());
        tx.setAnomalyScore(anomaly.getAnomalyScore() != null ? anomaly.getAnomalyScore() : 0.0);
        tx.setIsAnomaly(anomaly.getIsAnomaly() != null ? anomaly.getIsAnomaly() : false);

        return toResponse(transactionRepository.save(tx));
    }

    public List<TransactionResponse> getAllTransactions(Long userId) {
        return transactionRepository.findByUserIdOrderByTransactionDateDesc(userId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public TransactionResponse getTransactionById(Long userId, Long id) {
        Transaction tx = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        verifyOwnership(tx, userId);
        return toResponse(tx);
    }

    public TransactionResponse updateTransaction(Long userId, Long id, TransactionRequest request) {
        Transaction tx = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        verifyOwnership(tx, userId);

        tx.setMerchant(request.getMerchant());
        tx.setDescription(request.getDescription());
        tx.setAmount(request.getAmount());
        tx.setTransactionDate(request.getTransactionDate());
        tx.setPaymentMethod(request.getPaymentMethod());

        if (request.getCategory() != null && !request.getCategory().isBlank()) {
            tx.setCategory(request.getCategory());
        } else {
            MlCategoryResponse catResponse = mlClientService.predictCategory(
                    request.getMerchant(), request.getDescription());
            tx.setCategory(catResponse.getCategory());
            tx.setMlCategoryConfidence(catResponse.getConfidence());
        }

        return toResponse(transactionRepository.save(tx));
    }

    public void deleteTransaction(Long userId, Long id) {
        Transaction tx = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        verifyOwnership(tx, userId);
        transactionRepository.delete(tx);
    }

    public List<TransactionResponse> getRecentTransactions(Long userId) {
        return transactionRepository.findTop10ByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<TransactionResponse> importCsv(Long userId, MultipartFile file) {
        User user = getUser(userId);
        List<TransactionResponse> imported = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

            CSVParser parser = CSVFormat.DEFAULT
                    .builder()
                    .setHeader()
                    .setSkipHeaderRecord(true)
                    .setIgnoreHeaderCase(true)
                    .setTrim(true)
                    .build()
                    .parse(reader);

            for (CSVRecord record : parser) {
                try {
                    Transaction tx = new Transaction();
                    tx.setUser(user);
                    tx.setMerchant(record.get("merchant"));
                    tx.setDescription(safeGet(record, "description"));
                    tx.setAmount(new BigDecimal(record.get("amount")));
                    tx.setPaymentMethod(safeGet(record, "paymentMethod"));

                    String dateStr = record.get("date");
                    tx.setTransactionDate(parseDate(dateStr));

                    String category = safeGet(record, "category");
                    if (category == null || category.isBlank()) {
                        MlCategoryResponse cat = mlClientService.predictCategory(
                                tx.getMerchant(), tx.getDescription());
                        category = cat.getCategory();
                        tx.setMlCategoryConfidence(cat.getConfidence());
                    }
                    tx.setCategory(category);

                    MlAnomalyResponse anomaly = mlClientService.detectAnomaly(
                            tx.getAmount().doubleValue(), category, tx.getMerchant());
                    tx.setAnomalyScore(anomaly.getAnomalyScore() != null ? anomaly.getAnomalyScore() : 0.0);
                    tx.setIsAnomaly(anomaly.getIsAnomaly() != null ? anomaly.getIsAnomaly() : false);

                    imported.add(toResponse(transactionRepository.save(tx)));
                } catch (Exception e) {
                    log.warn("Skipping invalid CSV row {}: {}", record.getRecordNumber(), e.getMessage());
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse CSV: " + e.getMessage(), e);
        }

        return imported;
    }

    private LocalDate parseDate(String dateStr) {
        List<DateTimeFormatter> formatters = List.of(
                DateTimeFormatter.ofPattern("yyyy-MM-dd"),
                DateTimeFormatter.ofPattern("dd/MM/yyyy"),
                DateTimeFormatter.ofPattern("MM/dd/yyyy"),
                DateTimeFormatter.ofPattern("dd-MM-yyyy"));
        for (DateTimeFormatter fmt : formatters) {
            try {
                return LocalDate.parse(dateStr.trim(), fmt);
            } catch (DateTimeParseException ignored) {
            }
        }
        throw new IllegalArgumentException("Cannot parse date: " + dateStr);
    }

    private String safeGet(CSVRecord record, String column) {
        try {
            return record.get(column);
        } catch (Exception e) {
            return null;
        }
    }

    private void verifyOwnership(Transaction tx, Long userId) {
        if (!tx.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Access denied");
        }
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public TransactionResponse toResponse(Transaction tx) {
        TransactionResponse r = new TransactionResponse();
        r.setId(tx.getId());
        r.setMerchant(tx.getMerchant());
        r.setDescription(tx.getDescription());
        r.setAmount(tx.getAmount());
        r.setCategory(tx.getCategory());
        r.setTransactionDate(tx.getTransactionDate());
        r.setPaymentMethod(tx.getPaymentMethod());
        r.setAnomalyScore(tx.getAnomalyScore());
        r.setIsAnomaly(tx.getIsAnomaly());
        r.setMlCategoryConfidence(tx.getMlCategoryConfidence());
        r.setCreatedAt(tx.getCreatedAt());
        return r;
    }
}
