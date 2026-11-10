package com.finsight.backend.dto;

import java.math.BigDecimal;

public class DashboardSummary {
    private BigDecimal totalSpend;
    private BigDecimal totalBudget;
    private BigDecimal remainingBudget;
    private Long anomalyCount;
    private Long transactionCount;

    public DashboardSummary() {}

    public DashboardSummary(BigDecimal totalSpend, BigDecimal totalBudget,
                             BigDecimal remainingBudget, Long anomalyCount, Long transactionCount) {
        this.totalSpend = totalSpend;
        this.totalBudget = totalBudget;
        this.remainingBudget = remainingBudget;
        this.anomalyCount = anomalyCount;
        this.transactionCount = transactionCount;
    }

    public BigDecimal getTotalSpend() { return totalSpend; }
    public void setTotalSpend(BigDecimal totalSpend) { this.totalSpend = totalSpend; }
    public BigDecimal getTotalBudget() { return totalBudget; }
    public void setTotalBudget(BigDecimal totalBudget) { this.totalBudget = totalBudget; }
    public BigDecimal getRemainingBudget() { return remainingBudget; }
    public void setRemainingBudget(BigDecimal remainingBudget) { this.remainingBudget = remainingBudget; }
    public Long getAnomalyCount() { return anomalyCount; }
    public void setAnomalyCount(Long anomalyCount) { this.anomalyCount = anomalyCount; }
    public Long getTransactionCount() { return transactionCount; }
    public void setTransactionCount(Long transactionCount) { this.transactionCount = transactionCount; }
}

