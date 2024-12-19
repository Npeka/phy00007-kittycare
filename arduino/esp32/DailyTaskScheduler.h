#ifndef DAILY_TASK_SCHEDULER_H
#define DAILY_TASK_SCHEDULER_H

#include <Arduino.h>
#include <time.h>

class DailyTaskScheduler {
private:
  bool taskCompletedToday;
  uint8_t lastCheckedDay;

public:
  DailyTaskScheduler();
  bool isNeedToRunTask();
  bool isNeedToCloseDoor();
  String getName() const;
};

#endif
