package com.finsight.backend.dto;

public class MlCategoryRequest {
    private String merchant;
    private String description;

    public MlCategoryRequest() {}
    public MlCategoryRequest(String merchant, String description) {
        this.merchant = merchant;
        this.description = description;
    }

    public String getMerchant() { return merchant; }
    public void setMerchant(String merchant) { this.merchant = merchant; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}

