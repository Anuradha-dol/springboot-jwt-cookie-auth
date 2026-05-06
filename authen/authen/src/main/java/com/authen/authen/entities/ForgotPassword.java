package com.authen.authen.entities;


import com.authen.authen.dtos.RecoveryChannel;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder

public class ForgotPassword {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer fid;

    @Column(nullable = false)
    private Integer otp;

    @Column(nullable = false)
    private Date expirationTime;

    // Resend OTP tracking
    private Integer resendCount;          // number of times OTP was resent
    private Date firstResendTime;
    // start time of resend window

    // 🔹 Add this field to store which channel OTP was sent to
    @Enumerated(EnumType.STRING)
    private RecoveryChannel recoveryChannel;

    private Date blockUntil;           // if blocked, store block end time
    private Date lastSentAt;


    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;


}
