#include "DailyTaskScheduler.h"

DailyTaskScheduler::DailyTaskScheduler() : taskCompletedToday(false), lastCheckedDay(-1) {}

bool DailyTaskScheduler::isNeedToRunTask() {
  time_t now = time(nullptr);
  struct tm timeinfo;
  localtime_r(&now, &timeinfo);

  if (timeinfo.tm_hour >= 24) {
    timeinfo.tm_hour -= 24;
  }

  uint8_t curHour = timeinfo.tm_hour;
  uint8_t curMinute = timeinfo.tm_min;
  uint8_t curDay = timeinfo.tm_mday;
  uint8_t curMonth = timeinfo.tm_mon + 1;
  uint16_t curYear = timeinfo.tm_year + 1900;

  Serial.printf("Cur time: %02d:%02d, %02d/%02d/%04d\n", curHour, curMinute, curDay, curMonth, curYear);

  if (curDay != lastCheckedDay) {
    taskCompletedToday = false;
    lastCheckedDay = curDay;
  }

  if (curHour == 0 && curMinute >= 0 && curYear > 2023 && !taskCompletedToday) {
    taskCompletedToday = true;
    return true;
  }

  return false;
}

bool DailyTaskScheduler::isNeedToCloseDoor() {
  time_t now = time(nullptr);
  struct tm timeinfo;
  localtime_r(&now, &timeinfo);

  if (timeinfo.tm_hour >= 24) {
    timeinfo.tm_hour -= 24;
  }

  uint8_t curHour = timeinfo.tm_hour;
  uint8_t curMinute = timeinfo.tm_min;
  uint8_t curDay = timeinfo.tm_mday;
  uint8_t curMonth = timeinfo.tm_mon + 1;
  uint16_t curYear = timeinfo.tm_year + 1900;

  if (curHour == 21 && curMinute >= 0 && curYear > 2023) {
    Serial.printf("Close door at %02d:%02d, %02d/%02d/%04d\n", curHour, curMinute, curDay, curMonth, curYear);
    return true;
  }

  return false;
}

String DailyTaskScheduler::getName() const {
  return "daily_task_scheduler";
}
