package ua.com.danit.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import ua.com.danit.entity.User;

import java.util.List;

public interface UsersRepository extends JpaRepository<User, Long> {

  List<User> findByUserPhone(String userPhone);

  List<User> findByUserMail(String userMail);

  @Modifying(clearAutomatically = true)
  @Query(value =
      "UPDATE User u SET u.userIsOkUserPhoto = ?2, u.userIsOkCarPhoto = ?3"
          + " WHERE u.userId = ?1")
  void putUserModeration(Long userId, Integer userIsOkUserPhoto, Integer userIsOkCarPhoto);

  @Query(value = "SELECT * FROM users "
      + " WHERE COALESCE(user_is_ok_user_photo,0)<> 1"
      + " or COALESCE(user_is_ok_car_photo,0) <> 1 LIMIT 10", nativeQuery = true)
  List<User> getUserListForModeration();

}
