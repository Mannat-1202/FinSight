package com.finsight.backend.service;

import com.finsight.backend.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
public class MlClientService {

    private static final Logger log = LoggerFactory.getLogger(MlClientService.class);

    private final RestTemplate restTemplate;

    @Value("${ml.service.url}")
    private String mlServiceUrl;

    public MlClientService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public MlCategoryResponse predictCategory(String merchant, String description) {
        try {
            MlCategoryRequest request = new MlCategoryRequest(merchant,
                description != null ? description : "");
            return restTemplate.postForObject(
                mlServiceUrl + "/predict-category",
                request,
                MlCategoryResponse.class);
        } catch (RestClientException e) {
            log.warn("ML service unavailable for category prediction: {}", e.getMessage());
            MlCategoryResponse fallback = new MlCategoryResponse();
            fallback.setCategory("Uncategorized");
            fallback.setConfidence(0.0);
            return fallback;
        }
    }

    public MlAnomalyResponse detectAnomaly(Double amount, String category, String merchant) {
        try {
            MlAnomalyRequest request = new MlAnomalyRequest(amount,
                category != null ? category : "Uncategorized",
                merchant != null ? merchant : "");
            return restTemplate.postForObject(
                mlServiceUrl + "/detect-anomaly",
                request,
                MlAnomalyResponse.class);
        } catch (RestClientException e) {
            log.warn("ML service unavailable for anomaly detection: {}", e.getMessage());
            MlAnomalyResponse fallback = new MlAnomalyResponse();
            fallback.setAnomalyScore(0.0);
            fallback.setIsAnomaly(false);
            return fallback;
        }
    }
}

