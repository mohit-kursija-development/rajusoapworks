(function () {
  "use strict";

  var PAGE_SIZE = 60;
  var state = {
    all: [],
    filtered: [],
    visibleCount: PAGE_SIZE,
    autoplay: false
  };

  var els = {};

  document.addEventListener("DOMContentLoaded", function () {
    cacheEls();
    bindStaticEvents();
    fetch("data.json")
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load data.json (" + res.status + ")");
        return res.json();
      })
      .then(function (data) {
        state.all = data;
        populateFilters(data);
        applyFilters();
      })
      .catch(function (err) {
        els.resultCount.textContent = "Could not load exercise data.";
        console.error(err);
      });
  });

  function cacheEls() {
    els.searchInput = document.getElementById("searchInput");
    els.clearSearch = document.getElementById("clearSearch");
    els.bodyPartFilter = document.getElementById("bodyPartFilter");
    els.muscleFilter = document.getElementById("muscleFilter");
    els.equipmentFilter = document.getElementById("equipmentFilter");
    els.resetFilters = document.getElementById("resetFilters");
    els.resultCount = document.getElementById("resultCount");
    els.grid = document.getElementById("grid");
    els.emptyState = document.getElementById("emptyState");
    els.loadMoreWrap = document.getElementById("loadMoreWrap");
    els.loadMoreBtn = document.getElementById("loadMoreBtn");
    els.playAllToggle = document.getElementById("playAllToggle");
    els.modalBackdrop = document.getElementById("modalBackdrop");
    els.modal = document.getElementById("exerciseModal");
    els.modalClose = document.getElementById("modalClose");
    els.modalGif = document.getElementById("modalGif");
    els.modalTitle = document.getElementById("modalTitle");
    els.modalTags = document.getElementById("modalTags");
    els.modalSteps = document.getElementById("modalSteps");
    els.modalAttribution = document.getElementById("modalAttribution");
  }

  function bindStaticEvents() {
    var searchTimer = null;
    els.searchInput.addEventListener("input", function () {
      els.clearSearch.hidden = !els.searchInput.value;
      clearTimeout(searchTimer);
      searchTimer = setTimeout(applyFilters, 150);
    });

    els.clearSearch.addEventListener("click", function () {
      els.searchInput.value = "";
      els.clearSearch.hidden = true;
      els.searchInput.focus();
      applyFilters();
    });

    [els.bodyPartFilter, els.muscleFilter, els.equipmentFilter].forEach(function (sel) {
      sel.addEventListener("change", applyFilters);
    });

    els.resetFilters.addEventListener("click", function () {
      els.searchInput.value = "";
      els.clearSearch.hidden = true;
      els.bodyPartFilter.value = "";
      els.muscleFilter.value = "";
      els.equipmentFilter.value = "";
      applyFilters();
    });

    els.loadMoreBtn.addEventListener("click", function () {
      state.visibleCount += PAGE_SIZE;
      renderGrid();
    });

    els.playAllToggle.addEventListener("click", function () {
      state.autoplay = !state.autoplay;
      els.playAllToggle.setAttribute("aria-pressed", String(state.autoplay));
      els.playAllToggle.textContent = state.autoplay ? "Autoplay: on" : "Autoplay all GIFs";
      renderGrid();
    });

    els.modalClose.addEventListener("click", closeModal);
    els.modalBackdrop.addEventListener("click", closeModal);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !els.modal.hidden) closeModal();
    });
  }

  function uniqueSorted(values) {
    return Array.from(new Set(values.filter(Boolean))).sort();
  }

  function populateFilters(data) {
    var bodyParts = uniqueSorted(data.map(function (e) { return e.body_part; }));
    var muscles = uniqueSorted(
      data.reduce(function (acc, e) {
        if (e.target) acc.push(e.target);
        if (e.muscle_group) acc.push(e.muscle_group);
        return acc;
      }, [])
    );
    var equipment = uniqueSorted(data.map(function (e) { return e.equipment; }));

    fillSelect(els.bodyPartFilter, bodyParts);
    fillSelect(els.muscleFilter, muscles);
    fillSelect(els.equipmentFilter, equipment);
  }

  function fillSelect(select, values) {
    values.forEach(function (v) {
      var opt = document.createElement("option");
      opt.value = v;
      opt.textContent = capitalize(v);
      select.appendChild(opt);
    });
  }

  function capitalize(str) {
    return str.replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  function matchesMuscle(exercise, muscle) {
    if (!muscle) return true;
    if (exercise.target === muscle || exercise.muscle_group === muscle) return true;
    return (exercise.secondary_muscles || []).indexOf(muscle) !== -1;
  }

  function matchesSearch(exercise, query) {
    if (!query) return true;
    var haystack = [
      exercise.name,
      exercise.body_part,
      exercise.target,
      exercise.muscle_group,
      exercise.equipment
    ]
      .concat(exercise.secondary_muscles || [])
      .join(" ")
      .toLowerCase();
    return haystack.indexOf(query) !== -1;
  }

  function applyFilters() {
    var query = els.searchInput.value.trim().toLowerCase();
    var bodyPart = els.bodyPartFilter.value;
    var muscle = els.muscleFilter.value;
    var equipment = els.equipmentFilter.value;

    state.filtered = state.all.filter(function (e) {
      if (bodyPart && e.body_part !== bodyPart) return false;
      if (equipment && e.equipment !== equipment) return false;
      if (!matchesMuscle(e, muscle)) return false;
      if (!matchesSearch(e, query)) return false;
      return true;
    });

    state.visibleCount = PAGE_SIZE;
    renderGrid();
  }

  function renderGrid() {
    var items = state.filtered.slice(0, state.visibleCount);
    els.grid.innerHTML = "";

    var frag = document.createDocumentFragment();
    items.forEach(function (exercise) {
      frag.appendChild(buildCard(exercise));
    });
    els.grid.appendChild(frag);

    var total = state.filtered.length;
    els.resultCount.textContent = total === 0
      ? "0 exercises found"
      : "Showing " + Math.min(state.visibleCount, total) + " of " + total + " exercise" + (total === 1 ? "" : "s");

    els.emptyState.hidden = total !== 0;
    els.loadMoreWrap.hidden = state.visibleCount >= total;
  }

  function buildCard(exercise) {
    var card = document.createElement("button");
    card.type = "button";
    card.className = "card";
    card.setAttribute("aria-label", "View " + exercise.name + " animation and instructions");

    var media = document.createElement("div");
    media.className = "card-media";

    var img = document.createElement("img");
    img.loading = "lazy";
    img.alt = exercise.name;
    img.src = state.autoplay ? "gifs/" + exercise.gif : "images/" + exercise.image;
    media.appendChild(img);

    if (!state.autoplay) {
      var badge = document.createElement("span");
      badge.className = "card-play-badge";
      badge.textContent = "GIF";
      media.appendChild(badge);
    }

    var body = document.createElement("div");
    body.className = "card-body";

    var name = document.createElement("h3");
    name.className = "card-name";
    name.textContent = exercise.name;

    var tags = document.createElement("div");
    tags.className = "card-tags";
    tags.appendChild(makeTag(exercise.body_part, "tag-body"));
    if (exercise.target) tags.appendChild(makeTag(exercise.target));

    body.appendChild(name);
    body.appendChild(tags);

    card.appendChild(media);
    card.appendChild(body);

    card.addEventListener("click", function () { openModal(exercise); });

    return card;
  }

  function makeTag(text, extraClass) {
    var span = document.createElement("span");
    span.className = "tag" + (extraClass ? " " + extraClass : "");
    span.textContent = text;
    return span;
  }

  var lastFocused = null;

  function openModal(exercise) {
    lastFocused = document.activeElement;

    els.modalGif.src = "gifs/" + exercise.gif;
    els.modalGif.alt = exercise.name + " animation";
    els.modalTitle.textContent = exercise.name;

    els.modalTags.innerHTML = "";
    els.modalTags.appendChild(makeTag(exercise.body_part, "tag-body"));
    if (exercise.target) els.modalTags.appendChild(makeTag(exercise.target));
    if (exercise.muscle_group && exercise.muscle_group !== exercise.target) {
      els.modalTags.appendChild(makeTag(exercise.muscle_group));
    }
    if (exercise.equipment) els.modalTags.appendChild(makeTag(exercise.equipment));

    els.modalSteps.innerHTML = "";
    (exercise.instructions || []).forEach(function (step) {
      var li = document.createElement("li");
      li.textContent = step;
      els.modalSteps.appendChild(li);
    });

    els.modalAttribution.textContent = exercise.attribution || "";

    els.modalBackdrop.hidden = false;
    els.modal.hidden = false;
    document.body.style.overflow = "hidden";
    els.modalClose.focus();
  }

  function closeModal() {
    els.modal.hidden = true;
    els.modalBackdrop.hidden = true;
    els.modalGif.src = "";
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }
})();
