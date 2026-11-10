package com.finsight.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public class MonthComparison {
    private BigDecimal currentMonthTotal;
    private BigDecimal previousMonthTotal;
    private Double percentageChange;
    private List<CategoryTotal> categoryBreakdown;

    public MonthComparison() {}

    public BigDecimal getCurrentMonthTotal() { return currentMonthTotal; }
    public void setCurrentMonthTotal(BigDecimal currentMonthTotal) { this.currentMonthTotal = currentMonthTotal; }
    public BigDecimal getPreviousMonthTotal() { return previousMonthTotal; }
    public void setPreviousMonthTotal(BigDecimal previousMonthTotal) { this.previousMonthTotal = previousMonthTotal; }
    public Double getPercentageChange() { return percentageChange; }
    public void setPercentageChange(Double percentageChange) { this.percentageChange = percentageChange; }
    public List<CategoryTotal> getCategoryBreakdown() { return categoryBreakdown; }
    public void setCategoryBreakdown(List<CategoryTotal> categoryBreakdown) { this.categoryBreakdown = categoryBreakdown; }
}

