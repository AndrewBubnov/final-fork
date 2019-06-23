package ua.com.danit.dto;

import lombok.Data;

@Data
public class UserModerationResponse {
  private Long userId;
  private Integer userIsOkUserPhoto;
  private Integer userIsOkCarPhoto;
}
