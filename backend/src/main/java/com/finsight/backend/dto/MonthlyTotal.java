package com.finsight.backend.dto;

import java.math.BigDecimal;

public class MonthlyTotal {
    private Integer month;
    private Integer year;
    private BigDecimal total;

    public MonthlyTotal() {}

    public MonthlyTotal(Integer month, Integer year, BigDecimal total) {
        this.month = month;
        this.year = year;
        this.total = total;
    }

    public Integer getMonth() { return month; }
    public void setMonth(Integer month) { this.month = month; }
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }
    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }
}

