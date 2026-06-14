// ==========================================
// 1. ZEIT-FUNKTION & GLOBALE VARIABLEN
// ==========================================
function updateTime() {
  var currentTime = new Date().toLocaleString();
  var timeText = document.querySelector("#timeElement");
  if (timeText) {
    timeText.textContent = currentTime;
  }
}
setInterval(updateTime, 1000);
updateTime();

var biggestIndex = 10; 
var topBar = document.querySelector("div[style*='position: absolute; top: 0;']"); 
var selectedIcon = undefined;


// ==========================================
// 2. FENSTER INITIALISIEREN (Drag, Klick & Schließen)
// ==========================================
function initializeWindow(windowId) {
  var element = document.getElementById(windowId);
  if (!element) return;

  // A) Drag & Drop aktivieren
  dragElement(element);

  // B) Klick bringt Fenster nach vorn
  element.addEventListener("mousedown", function() {
    handleWindowTap(element);
  });

  // C) Schließen-Button (✕) aktivieren
  var closeButton = document.getElementById(windowId + "close");
  if (closeButton) {
    closeButton.addEventListener("click", function(e) {
      e.stopPropagation(); // Verhindert z-index Sprünge beim Schließen
      closeWindow(element);
    });
  }
}


// ==========================================
// 3. FENSTER-EBENEN STEUERUNG (z-index)
// ==========================================
function handleWindowTap(element) {
  biggestIndex++;
  element.style.zIndex = biggestIndex;
  
  if (topBar) {
    topBar.style.zIndex = biggestIndex + 1;
  }
  
  if (selectedIcon) {
    deselectIcon(selectedIcon);
  }
}

function openWindow(element) {
  if (!element) return;
  element.style.display = "flex";
  
  biggestIndex++;
  element.style.zIndex = biggestIndex;
  if (topBar) {
    topBar.style.zIndex = biggestIndex + 1;
  }
}

function closeWindow(element) {
  if (element) element.style.display = "none";
}


// ==========================================
// 4. ICON-AUSWAHL & DESKTOP-KLICK
// ==========================================
function selectIcon(element) {
  if (selectedIcon && selectedIcon !== element) {
    deselectIcon(selectedIcon);
  }
  element.classList.add("selected");
  selectedIcon = element;
} 

function deselectIcon(element) {
  element.classList.remove("selected");
  if (selectedIcon === element) {
    selectedIcon = undefined;
  }
}

window.handleIconTap = function(element, windowElement) {
  if (element.classList.contains("selected")) {
    deselectIcon(element);
    openWindow(windowElement);
  } else {
    selectIcon(element);
  }
}

document.body.addEventListener("click", function(e) {
  if (selectedIcon && !e.target.closest(".desktop-icon")) {
    deselectIcon(selectedIcon);
  }
}, true);


// ==========================================
// 5. DRAG & DROP LOGIK
// ==========================================
function dragElement(element) {
  var initialX = 0, initialY = 0, currentX = 0, currentY = 0;
  var header = document.getElementById(element.id + "header");

  if (header) {
    header.onmousedown = startDragging;
  } else {
    element.onmousedown = startDragging;
  }

  function startDragging(e) {
    e = e || window.event;
    e.preventDefault();
    initialX = e.clientX;
    initialY = e.clientY;
    document.onmouseup = stopDragging;
    document.onmousemove = elementDrag; 
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;
    element.style.top = (element.offsetTop - currentY) + "px";
    element.style.left = (element.offsetLeft - currentX) + "px";
  }

  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}


// ==========================================
// 6. APPS-INTERNE NAVIGATION (Tab-Umschaltung)
// ==========================================
function setupAppNavigation() {
  var btnCalendar = document.getElementById("btnCalendar");
  var btnReports = document.getElementById("btnReports");
  var viewCalendar = document.getElementById("raceCalendar");
  var viewReports = document.getElementById("raceReports");

  if (btnCalendar && btnReports && viewCalendar && viewReports) {
    
    // Klick auf Kalender
    btnCalendar.addEventListener("click", function(e) {
      e.stopPropagation();
      viewCalendar.style.display = "block";
      viewReports.style.display = "none";
      
      btnCalendar.classList.add("active");
      btnReports.classList.remove("active");
    });

    // Klick auf Berichte
    btnReports.addEventListener("click", function(e) {
      e.stopPropagation();
      viewCalendar.style.display = "none"; // FIXED: Kein .style.style mehr!
      viewReports.style.display = "block";
      
      btnReports.classList.add("active");
      btnCalendar.classList.remove("active");
    });
  }
}


// ==========================================
// 7. WECHSEL DER SEITENBERICHTE (Sidebar)
// ==========================================
window.showReport = function(raceId) {
  var allTexts = document.querySelectorAll(".report-text");
  allTexts.forEach(function(text) {
    text.style.display = "none";
  });
  
  var selectedText = document.getElementById("report-" + raceId);
  if (selectedText) {
    selectedText.style.display = "block";
  }
  
  var allLinks = document.querySelectorAll(".report-link");
  allLinks.forEach(function(link) {
    link.classList.remove("active-report");
  });
  
  var clickedLink = document.querySelector(`.report-link[onclick*='${raceId}']`);
  if (clickedLink) {
    clickedLink.classList.add("active-report");
  }
}


// ==========================================
// 8. SYSTEM START (Initialisierung)
// ==========================================
// Erst die Fenster bereitmachen
// ==========================================
// 8. SYSTEM START (Mit Live-Diagnose)
// ==========================================
console.log("--- Lando OS Debugger startet ---");

// Fenster initialisieren
initializeWindow("welcome");
initializeWindow("raceWindow");
initializeWindow("standingsWindow");

// App-Navigation aktivieren
setupAppNavigation();

// Taskleisten-Button verknüpfen
var topBarWelcomeOpen = document.getElementById("taskbarWelcomeOpen");
if (topBarWelcomeOpen) {
  topBarWelcomeOpen.addEventListener("click", function() {
    openWindow(document.getElementById("welcome"));
  });
}

// HIER ERSETZEN (GANZ UNTEN IN SCRIPT.JS):
["welcomeclose", "raceclose", "standingsclose"].forEach(function(id) {
  var btn = document.getElementById(id);
  if (!btn) {
    console.error("❌ FEHLER: Button mit der ID '" + id + "' wurde im HTML nicht gefunden!");
  } else {
    console.log("✅ ERFOLG: Button '" + id + "' ist bereit zum Klicken.");
    
    btn.onclick = function(e) {
      e.stopPropagation();
      
      // Hier ermitteln wir das richtige Fenster passend zum geklickten X
      var targetWin;
      if (id === "welcomeclose") targetWin = "welcome";
      if (id === "raceclose") targetWin = "raceWindow";
      if (id === "standingsclose") targetWin = "standingsWindow";
      
      var windowElement = document.getElementById(targetWin);
      if (windowElement) {
        windowElement.style.display = "none";
        console.log("ℹ️ Fenster '" + targetWin + "' über Fallback-Klick geschlossen.");
      }
    };
  }
});

// GANZ UNTEN IN SCRIPT.JS ANFÜGEN:
function setupStandingsNavigation() {
  var btnDrivers = document.getElementById("btnDrivers");
  var btnTeams = document.getElementById("btnTeams");
  var viewDrivers = document.getElementById("viewDrivers");
  var viewTeams = document.getElementById("viewTeams");

  if (btnDrivers && btnTeams && viewDrivers && viewTeams) {
    // Klick auf Fahrer-WM
    btnDrivers.addEventListener("click", function(e) {
      e.stopPropagation();
      viewDrivers.style.display = "block";
      viewTeams.style.display = "none";
      btnDrivers.classList.add("active");
      btnTeams.classList.remove("active");
    });

    // Klick auf Team-WM
    btnTeams.addEventListener("click", function(e) {
      e.stopPropagation();
      viewDrivers.style.display = "none";
      viewTeams.style.display = "block";
      btnTeams.classList.add("active");
      btnDrivers.classList.remove("active");
    });
  }
}

// Funktion ausführen
setupStandingsNavigation();