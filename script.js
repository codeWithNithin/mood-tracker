const allMoodBtns = document.querySelectorAll('.mood');
const moodContainer = document.getElementById('mood-container');

// Handle mood selection
allMoodBtns.forEach(element => {
  element.addEventListener('click', () => {
    const mood = element.getAttribute('data-mood');
    saveMood(mood);
  });
});


// hide emojis element, if the mood has been choosed for the day
function hideEmojis() {
  const today = new Date();
  const moods = getLocalStorage('moods');
  const moodForToday = moods.find(mood => new Date(mood.date).toDateString() === today.toDateString());
  console.log('moodForToday', moodForToday);
  if (moodForToday) {
    moodContainer.style.display = 'none';
  }
}

hideEmojis();


// Helper function to save mood to LocalStorage
function saveMood(mood) {
  const date = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  let moods = getLocalStorage('moods') || [];
  moods.push({ mood, date });
  setLocalStorage('moods', moods);
  hideEmojis();
  showCalendarView()
}


function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

// Show mood timeline
function showMoodTimeline(view) {
  const moods = getLocalStorage('moods');
  let filteredMoods;

  const today = new Date();
  if (view === 'day') {
    filteredMoods = moods.filter(mood => mood.date === today.toISOString().split('T')[0]);
  } else if (view === 'week') {
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    filteredMoods = moods.filter(mood => {
      const moodDate = new Date(mood.date);
      return moodDate >= startOfWeek && moodDate <= endOfWeek;
    });
  } else if (view === 'month') {
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    filteredMoods = moods.filter(mood => {
      const moodDate = new Date(mood.date);
      return moodDate >= startOfMonth && moodDate <= endOfMonth;
    });
  }

  displayMoodTimeline(filteredMoods);
}

// Display mood timeline
function displayMoodTimeline(moods) {
  const timelineDiv = document.getElementById('mood-timeline');
  timelineDiv.innerHTML = '';
  if (moods.length === 0) {
    timelineDiv.innerHTML = 'No moods recorded for this period.';
  } else {
    moods.forEach(mood => {
      const moodElement = document.createElement('div');
      moodElement.textContent = `${mood.date}: ${mood.mood}`;
      timelineDiv.appendChild(moodElement);
    });

  }
}

// Display moods on a calendar view
function showCalendarView() {
  const moods = getLocalStorage('moods');
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const currentDateele = document.getElementById('current-date');

  currentDateele.textContent = `${firstDayOfMonth.toLocaleDateString([], { month: 'long' })} ${firstDayOfMonth.getFullYear()}`;

  const calendarDiv = document.getElementById('calendar');
  calendarDiv.innerHTML = '';
  const daysInMonth = lastDayOfMonth.getDate();

  // Create grid of days
  for (let i = 1; i <= daysInMonth; i++) {
    const dayDiv = document.createElement('div');
    const date = new Date(today.getFullYear(), today.getMonth(), i);
    dayDiv.textContent = i;

    // Check if there is a mood for this day
    const mood = moods.find(mood => new Date(mood.date).getDate() === i);
    if (mood) {
      dayDiv.style.backgroundColor = '#f0f0f0';
      dayDiv.title = `Mood: ${mood.mood}`;
    }
    calendarDiv.appendChild(dayDiv);
  }
}

// Load initial calendar view
showCalendarView();