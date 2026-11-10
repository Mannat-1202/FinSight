package com.finsight.backend.dto;

import java.math.BigDecimal;

public class CategoryTotal {
    private String category;
    private BigDecimal total;
    private Double percentage;

    public CategoryTotal() {}

    public CategoryTotal(String category, BigDecimal total, Double percentage) {
        this.category = category;
        this.total = total;
        this.percentage = percentage;
    }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }
    public Double getPercentage() { return percentage; }
    public void setPercentage(Double percentage) { this.percentage = percentage; }
}

