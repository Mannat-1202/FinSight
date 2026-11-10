package com.finsight.backend.controller;

import com.finsight.backend.dto.*;
import com.finsight.backend.security.UserPrincipal;
import com.finsight.backend.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final DashboardService dashboardService;

    public AnalyticsController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryTotal>> categories(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        LocalDate now = LocalDate.now();
        int m = month != null ? month : now.getMonthValue();
        int y = year != null ? year : now.getYear();
        return ResponseEntity.ok(dashboardService.getCategoryTotals(principal.getUserId(), m, y));
    }

    @GetMapping("/monthly")
    public ResponseEntity<List<MonthlyTotal>> monthly(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) Integer year) {
        int y = year != null ? year : LocalDate.now().getYear();
        return ResponseEntity.ok(dashboardService.getMonthlyTotals(principal.getUserId(), y));
    }

    @GetMapping("/comparison")
    public ResponseEntity<MonthComparison> comparison(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(dashboardService.getComparison(principal.getUserId()));
    }
}

