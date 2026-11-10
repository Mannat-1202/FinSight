package com.finsight.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MlCategoryResponse {
    private String category;
    private Double confidence;

    @JsonProperty("anomaly_score")
    private Double anomalyScore;

    @JsonProperty("is_anomaly")
    private Boolean isAnomaly;

    public MlCategoryResponse() {}

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }
    public Double getAnomalyScore() { return anomalyScore; }
    public void setAnomalyScore(Double anomalyScore) { this.anomalyScore = anomalyScore; }
    public Boolean getIsAnomaly() { return isAnomaly; }
    public void setIsAnomaly(Boolean isAnomaly) { this.isAnomaly = isAnomaly; }
}

