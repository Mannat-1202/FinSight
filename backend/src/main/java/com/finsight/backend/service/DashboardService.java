package com.finsight.backend.service;

import com.finsight.backend.dto.*;
import com.finsight.backend.repository.BudgetRepository;
import com.finsight.backend.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;

    public DashboardService(TransactionRepository transactionRepository,
                             BudgetRepository budgetRepository) {
        this.transactionRepository = transactionRepository;
        this.budgetRepository = budgetRepository;
    }

    public DashboardSummary getSummary(Long userId) {
        LocalDate now = LocalDate.now();
        int month = now.getMonthValue();
        int year = now.getYear();

        BigDecimal totalSpend = transactionRepository.sumTotalForMonth(userId, month, year);
        if (totalSpend == null) totalSpend = BigDecimal.ZERO;

        List<com.finsight.backend.model.Budget> budgets =
            budgetRepository.findByUserIdAndMonthAndYear(userId, month, year);
        BigDecimal totalBudget = budgets.stream()
            .map(com.finsight.backend.model.Budget::getLimitAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal remaining = totalBudget.subtract(totalSpend);
        long anomalyCount = transactionRepository.countByUserIdAndIsAnomalyTrue(userId);
        long txCount = transactionRepository.countByUserId(userId);

        return new DashboardSummary(totalSpend, totalBudget, remaining, anomalyCount, txCount);
    }

    public List<CategoryTotal> getCategoryTotals(Long userId, int month, int year) {
        List<Object[]> raw = transactionRepository.sumByCategoryForMonth(userId, month, year);
        BigDecimal grandTotal = raw.stream()
            .map(r -> (BigDecimal) r[1])
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        return raw.stream().map(r -> {
            String cat = (String) r[0];
            BigDecimal total = (BigDecimal) r[1];
            double pct = grandTotal.compareTo(BigDecimal.ZERO) == 0 ? 0.0 :
                total.divide(grandTotal, 4, RoundingMode.HALF_UP)
                     .multiply(BigDecimal.valueOf(100)).doubleValue();
            return new CategoryTotal(cat, total, pct);
        }).collect(Collectors.toList());
    }

    public List<MonthlyTotal> getMonthlyTotals(Long userId, int year) {
        return transactionRepository.sumByMonthForYear(userId, year).stream()
            .map(r -> new MonthlyTotal(
                ((Number) r[0]).intValue(),
                ((Number) r[1]).intValue(),
                (BigDecimal) r[2]))
            .collect(Collectors.toList());
    }

    public MonthComparison getComparison(Long userId) {
        LocalDate now = LocalDate.now();
        int curMonth = now.getMonthValue();
        int curYear = now.getYear();

        LocalDate prev = now.minusMonths(1);
        int prevMonth = prev.getMonthValue();
        int prevYear = prev.getYear();

        BigDecimal current = transactionRepository.sumTotalForMonth(userId, curMonth, curYear);
        if (current == null) current = BigDecimal.ZERO;

        BigDecimal previous = transactionRepository.sumTotalForMonth(userId, prevMonth, prevYear);
        if (previous == null) previous = BigDecimal.ZERO;

        double pctChange = previous.compareTo(BigDecimal.ZERO) == 0 ? 0.0 :
            current.subtract(previous)
                   .divide(previous, 4, RoundingMode.HALF_UP)
                   .multiply(BigDecimal.valueOf(100)).doubleValue();

        List<CategoryTotal> breakdown = getCategoryTotals(userId, curMonth, curYear);

        MonthComparison comparison = new MonthComparison();
        comparison.setCurrentMonthTotal(current);
        comparison.setPreviousMonthTotal(previous);
        comparison.setPercentageChange(pctChange);
        comparison.setCategoryBreakdown(breakdown);
        return comparison;
    }
}

