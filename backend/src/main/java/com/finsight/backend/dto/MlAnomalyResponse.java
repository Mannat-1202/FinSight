package com.finsight.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MlAnomalyResponse {

    @JsonProperty("anomaly_score")
    private Double anomalyScore;

    @JsonProperty("is_anomaly")
    private Boolean isAnomaly;

    public MlAnomalyResponse() {}

    public Double getAnomalyScore() { return anomalyScore; }
    public void setAnomalyScore(Double anomalyScore) { this.anomalyScore = anomalyScore; }
    public Boolean getIsAnomaly() { return isAnomaly; }
    public void setIsAnomaly(Boolean isAnomaly) { this.isAnomaly = isAnomaly; }
}

