const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

function getDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function getStartOfDay(date) {
  return new Date(`${getDateKey(date)}T00:00:00Z`);
}

function getActivityByDate(logs) {
  return logs.reduce((activityByDate, log) => {
    const date = log.logged_at.slice(0, 10);
    activityByDate[date] = (activityByDate[date] || 0) + log.duration_minutes;

    return activityByDate;
  }, {});
}

function getCurrentStreak(activityByDate, today) {
  let streak = 0;
  const date = new Date(today);

  date.setUTCDate(date.getUTCDate() - 1);

  while (activityByDate[getDateKey(date)]) {
    streak += 1;
    date.setUTCDate(date.getUTCDate() - 1);
  }

  return streak;
}

function getPersonalBest(activityByDate) {
  const activeDates = Object.keys(activityByDate).sort();
  let longestStreak = 0;
  let streak = 0;
  let previousDate = null;

  activeDates.forEach((dateKey) => {
    const currentDate = getStartOfDay(new Date(`${dateKey}T00:00:00Z`));

    if (previousDate && currentDate - previousDate === DAY_IN_MILLISECONDS) {
      streak += 1;
    } else {
      streak = 1;
    }

    longestStreak = Math.max(longestStreak, streak);
    previousDate = currentDate;
  });

  return longestStreak;
}

function getWeekStart(today) {
  const weekStart = new Date(today);
  const dayOfWeek = weekStart.getUTCDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  weekStart.setUTCDate(weekStart.getUTCDate() - daysSinceMonday);

  return weekStart;
}

function getMinutesBetween(activityByDate, startDate, endDate) {
  let minutes = 0;
  const date = new Date(startDate);

  while (date < endDate) {
    minutes += activityByDate[getDateKey(date)] || 0;
    date.setUTCDate(date.getUTCDate() + 1);
  }

  return minutes;
}

function getLast14Days(activityByDate, today) {
  const days = [];
  const firstDay = new Date(today);

  firstDay.setUTCDate(firstDay.getUTCDate() - 14);

  for (let index = 0; index < 14; index += 1) {
    const date = new Date(firstDay);

    date.setUTCDate(date.getUTCDate() + index);
    days.push({
      date: getDateKey(date),
      minutes: activityByDate[getDateKey(date)] || 0,
    });
  }

  return days;
}

export function createDashboardData(appData) {
  const today = getStartOfDay(new Date(appData.simulation_context.dashboard_as_of));
  const activityByDate = getActivityByDate(appData.learning_logs);
  const currentMonth = getDateKey(today).slice(0, 7);
  const daysLoggedThisMonth = Object.keys(activityByDate).filter((date) =>
    date.startsWith(currentMonth),
  ).length;
  const weekStart = getWeekStart(today);
  const previousWeekStart = new Date(weekStart);
  const nextWeekStart = new Date(weekStart);

  previousWeekStart.setUTCDate(previousWeekStart.getUTCDate() - 7);
  nextWeekStart.setUTCDate(nextWeekStart.getUTCDate() + 7);

  const thisWeekMinutes = getMinutesBetween(activityByDate, weekStart, nextWeekStart);
  const previousWeekMinutes = getMinutesBetween(
    activityByDate,
    previousWeekStart,
    weekStart,
  );

  return {
    profile: appData.profiles[0],
    today: getDateKey(today),
    currentStreak: getCurrentStreak(activityByDate, today),
    personalBest: getPersonalBest(activityByDate),
    daysLoggedThisMonth,
    daysElapsedThisMonth: today.getUTCDate(),
    thisWeekHours: thisWeekMinutes / 60,
    weeklyHoursChange: (thisWeekMinutes - previousWeekMinutes) / 60,
    isOnTrack: daysLoggedThisMonth / today.getUTCDate() >= 0.6,
    recentLogs: [...appData.learning_logs]
      .sort((first, second) => second.logged_at.localeCompare(first.logged_at))
      .slice(0, 4),
    activityByDate,
    activityLast14Days: getLast14Days(activityByDate, today),
    goals: appData.goals,
  };
}
