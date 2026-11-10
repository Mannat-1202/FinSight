package com.finsight.backend.repository;

import com.finsight.backend.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserIdOrderByTransactionDateDesc(Long userId);

    List<Transaction> findByUserIdAndTransactionDateBetweenOrderByTransactionDateDesc(
        Long userId, LocalDate start, LocalDate end);

    List<Transaction> findTop10ByUserIdOrderByCreatedAtDesc(Long userId);

    long countByUserIdAndIsAnomalyTrue(Long userId);

    @Query("SELECT t.category, SUM(t.amount) FROM Transaction t " +
           "WHERE t.user.id = :userId " +
           "AND MONTH(t.transactionDate) = :month " +
           "AND YEAR(t.transactionDate) = :year " +
           "GROUP BY t.category")
    List<Object[]> sumByCategoryForMonth(@Param("userId") Long userId,
                                          @Param("month") int month,
                                          @Param("year") int year);

    @Query("SELECT MONTH(t.transactionDate), YEAR(t.transactionDate), SUM(t.amount) " +
           "FROM Transaction t WHERE t.user.id = :userId AND YEAR(t.transactionDate) = :year " +
           "GROUP BY YEAR(t.transactionDate), MONTH(t.transactionDate) " +
           "ORDER BY MONTH(t.transactionDate)")
    List<Object[]> sumByMonthForYear(@Param("userId") Long userId, @Param("year") int year);

    @Query("SELECT SUM(t.amount) FROM Transaction t " +
           "WHERE t.user.id = :userId " +
           "AND MONTH(t.transactionDate) = :month " +
           "AND YEAR(t.transactionDate) = :year")
    BigDecimal sumTotalForMonth(@Param("userId") Long userId,
                                @Param("month") int month,
                                @Param("year") int year);

    @Query("SELECT SUM(t.amount) FROM Transaction t " +
           "WHERE t.user.id = :userId AND t.category = :category " +
           "AND MONTH(t.transactionDate) = :month AND YEAR(t.transactionDate) = :year")
    BigDecimal sumByCategoryAndMonth(@Param("userId") Long userId,
                                     @Param("category") String category,
                                     @Param("month") int month,
                                     @Param("year") int year);

    long countByUserId(Long userId);
}

