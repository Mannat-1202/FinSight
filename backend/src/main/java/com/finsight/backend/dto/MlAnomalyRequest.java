package com.finsight.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MlAnomalyRequest {
    private Double amount;
    private String category;
    private String merchant;

    public MlAnomalyRequest() {}
    public MlAnomalyRequest(Double amount, String category, String merchant) {
        this.amount = amount;
        this.category = category;
        this.merchant = merchant;
    }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getMerchant() { return merchant; }
    public void setMerchant(String merchant) { this.merchant = merchant; }
}

