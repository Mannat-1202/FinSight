package com.finsight.backend.service;

import com.finsight.backend.dto.BudgetRequest;
import com.finsight.backend.dto.BudgetResponse;
import com.finsight.backend.exception.ResourceNotFoundException;
import com.finsight.backend.exception.UnauthorizedException;
import com.finsight.backend.model.Budget;
import com.finsight.backend.model.User;
import com.finsight.backend.repository.BudgetRepository;
import com.finsight.backend.repository.TransactionRepository;
import com.finsight.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public BudgetService(BudgetRepository budgetRepository,
                          TransactionRepository transactionRepository,
                          UserRepository userRepository) {
        this.budgetRepository = budgetRepository;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    public BudgetResponse createOrUpdateBudget(Long userId, BudgetRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Optional<Budget> existing = budgetRepository.findByUserIdAndCategoryAndMonthAndYear(
            userId, request.getCategory(), request.getMonth(), request.getYear());

        Budget budget = existing.orElse(new Budget());
        budget.setUser(user);
        budget.setCategory(request.getCategory());
        budget.setLimitAmount(request.getLimitAmount());
        budget.setMonth(request.getMonth());
        budget.setYear(request.getYear());

        return toResponse(budgetRepository.save(budget), userId);
    }

    public List<BudgetResponse> getBudgets(Long userId, int month, int year) {
        return budgetRepository.findByUserIdAndMonthAndYear(userId, month, year)
                .stream()
                .map(b -> toResponse(b, userId))
                .collect(Collectors.toList());
    }

    public List<BudgetResponse> getBudgetStatus(Long userId) {
        LocalDate now = LocalDate.now();
        return budgetRepository.findByUserIdAndMonthAndYear(userId, now.getMonthValue(), now.getYear())
                .stream()
                .map(b -> toResponse(b, userId))
                .collect(Collectors.toList());
    }

    public void deleteBudget(Long userId, Long id) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found"));
        if (!budget.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Access denied");
        }
        budgetRepository.delete(budget);
    }

    private BudgetResponse toResponse(Budget budget, Long userId) {
        BigDecimal spent = transactionRepository.sumByCategoryAndMonth(
            userId, budget.getCategory(), budget.getMonth(), budget.getYear());
        if (spent == null) spent = BigDecimal.ZERO;

        double pct = budget.getLimitAmount().compareTo(BigDecimal.ZERO) == 0 ? 0.0 :
            spent.divide(budget.getLimitAmount(), 4, RoundingMode.HALF_UP)
                 .multiply(BigDecimal.valueOf(100)).doubleValue();

        BudgetResponse r = new BudgetResponse();
        r.setId(budget.getId());
        r.setCategory(budget.getCategory());
        r.setLimitAmount(budget.getLimitAmount());
        r.setMonth(budget.getMonth());
        r.setYear(budget.getYear());
        r.setSpentAmount(spent);
        r.setPercentageUsed(pct);
        return r;
    }
}

