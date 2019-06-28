package ua.com.danit.dto;

import lombok.Data;

import java.util.List;

@Data
public class UserResponseModeration {
  private String userId;
  private String userName;
  private String userPhone;
  private String userMail;
  private String userPhoto;
  private String userRole;
  private Integer userIsOkUserPhoto;
  private Integer userIsOkCarPhoto;
  private Integer userIsConfirmedMail;
  private Integer userIsConfirmedPhone;
  private List<UserCarResponse> userCars;
}
