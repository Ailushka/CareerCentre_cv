/* -------------------- */
/*     Smooth links     */
/* -------------------- */

const smoothLinks = document.querySelectorAll('a[href^="#"]');
for (let smoothLink of smoothLinks) {
    smoothLink.addEventListener('click', function (e) {
        e.preventDefault();
        const id = smoothLink.getAttribute('href');

        document.querySelector(id).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
};

/* -------------------- */
/*      Mobile menu     */
/* -------------------- */

const burgerButton = document.querySelector('.burger');
const nav = document.querySelector('.nav');
const menuLinks = document.querySelectorAll('.nav-list__link');

burgerButton.addEventListener("click", function () {
    burgerButton.classList.toggle("burger_active");
    nav.classList.toggle("nav_opened");
    nav.classList.toggle("transition");
    document.querySelector('.page').classList.toggle('no-scroll');
    document.querySelector('html').classList.toggle('no-scroll');
});

menuLinks.forEach(menuLink => {
  menuLink.addEventListener('click', () => {
    burgerButton.classList.remove("burger_active");
    nav.classList.remove("nav_opened");
    nav.classList.remove("transition");
    document.querySelector('.page').classList.remove('no-scroll');
    document.querySelector('html').classList.remove('no-scroll');
  })
});

/* -------------------- */
/*         Popup        */
/* -------------------- */

const requestButtons = document.querySelectorAll('.button_type_request');
const closeButtons = document.querySelectorAll('.button_type_close');
const requestPopup = document.querySelector('.popup_type_request');

const iframe = requestPopup.querySelector('.form');
const iframeSrc = 'https://forms.yandex.ru/u/63c8065d84227c5465debf4c/?iframe=1';

const requestForm = document.querySelector('.form_type_request');
const successPopup = document.querySelector('.popup_type_success');
const reviewPopup = document.querySelector('.popup_type_review');
const reviewName = reviewPopup.querySelector('.reviews__name');
const reviewContent = reviewPopup.querySelector('.reviews__text');
const reviewImageName = reviewPopup.querySelector('.reviews__image');
const reviewImageLink = reviewPopup.querySelector('.reviews__image');
const reviews = document.querySelectorAll('.reviews-list__item');
const ESCAPE = 27;

function openPopUp(popup) {
  popup.classList.add('popup_opened');
  popup.classList.add('transition');
  document.querySelector('.page').classList.add('no-scroll');
  document.addEventListener('click', closePopUpByOverlay);
  document.addEventListener('keydown', closePopUpByEsc);

}

function closePopUp(popup) {
  popup.classList.remove('popup_opened');
  popup.classList.remove('transition');
  document.querySelector('.page').classList.remove('no-scroll');
  iframe.src = '';
  document.removeEventListener('click', closePopUpByOverlay);
  document.removeEventListener('keydown', closePopUpByEsc);
}

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}

function closePopUpByOverlay(evt) {
  if (evt.target.classList.contains('popup_opened')) {
    closePopUp(evt.target);
  }
}

function closePopUpByEsc(evt) {
  const popupOpened = document.querySelector('.popup_opened');
  if (evt.keyCode === ESCAPE) {
    closePopUp(popupOpened);
  }
}

requestButtons.forEach((item) => {
  item.addEventListener('click', () => {
    const dataSrc = item.getAttribute('data-src');
    const newIframeSrc = `${iframeSrc}&utm_source=${dataSrc}`;
    iframe.setAttribute('src', newIframeSrc);

    iframe.onload = () => {
      openPopUp(requestPopup);
      iframe.onload = null;
    };
  });
});

reviews.forEach((item) => {
  item.addEventListener('click', (evt) => {
    const reviewToOpen = evt.target.closest('.reviews-list__item');
    const openedReviewName = reviewToOpen.querySelector('.reviews__name').textContent;
    const openedReviewContent = reviewToOpen.querySelector('.reviews__text').textContent;
    const openedReviewImageName = reviewToOpen.querySelector('.reviews__image').alt;
    const openedReviewImageLink = reviewToOpen.querySelector('.reviews__image').src;

    reviewName.textContent = openedReviewName;
    reviewContent.textContent = openedReviewContent;
    reviewImageName.alt = openedReviewImageName;
    reviewImageLink.src = openedReviewImageLink;

      openPopUp(reviewPopup);
  });
});

closeButtons.forEach((item) => {
  item.addEventListener('click', (evt) => {
      const popUpToClose = evt.target.closest('.popup');
      closePopUp(popUpToClose);
  });
});

/* -------------------- */
/*       Accordeon      */
/* -------------------- */

document.querySelectorAll('.accordeon__button').forEach((item) => {
  item.addEventListener('click', (evt) => {
    const content = item.querySelector('.accordeon__content');

    if (!item.classList.contains('accordeon__button_active'))
    {
      item.classList.add('accordeon__button_active');
      content.style.maxHeight = content.scrollHeight + 'px';
    } else {
      item.classList.remove('accordeon__button_active');
      content.style.maxHeight = '';
    }
  })
})

/* -------------------- */
/*   Show-more button   */
/* -------------------- */

const showMoreButtons = document.querySelectorAll('.button_type_show-more');

showMoreButtons.forEach(button => {
  button.addEventListener('click', () => {
    const moreContent = button.closest('.expert').querySelector('.expert__extra-description');

    if (button.getAttribute('aria-expanded') === 'false') {
      button.setAttribute('aria-expanded', 'true');
      moreContent.style.maxHeight = moreContent.scrollHeight + 'px';
    } else {
      button.setAttribute('aria-expanded', 'false');
      moreContent.style.maxHeight = '';
    }
  })
})

/* -------------------- */
/*    Carousel slider   */
/* -------------------- */

const sliderInstances = {};

const initSlider = (slider) => {
  const sliderContainer = slider.querySelector('.slider__container');
  const sliderItems = slider.querySelectorAll('.slider__item');
  const next = slider.querySelector('.slide-arrow_next');
  const prev = slider.querySelector('.slide-arrow_prev');
  const slideGap = parseInt(getComputedStyle(sliderContainer).gap, 10);
  let currentSlide = 0;

  sliderItems[currentSlide].classList.add("activeSlide");

  let itemWidth = sliderItems[0].clientWidth;

  const sliderItemsToShow = Math.floor(sliderContainer.clientWidth / itemWidth);

  let resizeTimer;

  function handleResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      currentSlide = 0;
      sliderContainer.style.transform = "translateY(0px)";
      prev.classList.add("slide-arrow_disabled");
      next.classList.remove("slide-arrow_disabled");
      itemWidth = sliderItems[0].clientWidth;
    }, 200);
  }

  sliderContainer.style.transform = "translateY(0px)";

  const toggleClass = (condition, elem, className) => {
    condition
      ? elem.classList.add(className)
      : elem.classList.remove(className);
  };

  const handlePrevNextBtn = () => {
    toggleClass(currentSlide === 0, prev, "slide-arrow_disabled");
    toggleClass(currentSlide === sliderItems.length - sliderItemsToShow, next, "slide-arrow_disabled");
  };

  handlePrevNextBtn();

  const handleSlide = (condition, slideElem, event) => {
    const slideTransformValue = slideElem.style.transform;
    const translateXValue = slideTransformValue.replace(/[^\d.]/g, "");

    if (condition && event === "next") {
      currentSlide += 1;
      slideElem.style.transform = `translateX(-${
        +translateXValue + itemWidth + slideGap
      }px)`;
    } else if (condition && event === "prev") {
      currentSlide -= 1;
      slideElem.style.transform = `translateX(-${
        +translateXValue - itemWidth - slideGap
      }px)`;
    }
    sliderItems.forEach((e) => e.classList.remove("activeSlide"));
    sliderItems[currentSlide].classList.add("activeSlide");
  };

  const handleNextClick = () => {
    handleSlide(currentSlide !== sliderItems.length - sliderItemsToShow, sliderContainer, "next");
    handlePrevNextBtn();
  };

  const handlePrevClick = () => {
    handleSlide(currentSlide !== 0, sliderContainer, "prev");
    handlePrevNextBtn();
  };

  next.addEventListener("click", handleNextClick);
  prev.addEventListener("click", handlePrevClick);

  const removeClickHandlers = () => {
    next.removeEventListener("click", handleNextClick);
    prev.removeEventListener("click", handlePrevClick);
  };

  sliderInstances[slider.getAttribute("id")] = {
    removeClickHandlers,
    sliderContainer,
    next,
    prev
  };
};

const sliders = document.querySelectorAll('.slider');

sliders.forEach(slider => initSlider(slider));

/* -------------------- */
/*  Equal size columns  */
/* -------------------- */

function handleEqualSize() {
  const rates = document.querySelector('.rates');
  const firstSteps = rates.querySelectorAll(".rate:first-child .step");
  const secondSteps = rates.querySelectorAll(".rate:nth-child(2) .step");

  for (let i = 0; i < firstSteps.length; i++) {
    const firstStepHeight = firstSteps[i].offsetHeight;
    const secondStepHeight = secondSteps[i].offsetHeight;

    const maxHeight = Math.max(firstStepHeight, secondStepHeight);

    firstSteps[i].style.height = maxHeight + 'px';
    secondSteps[i].style.height = maxHeight + 'px';
  }
}

const mediaQuery = window.matchMedia('(min-width: 600px)');

function handleTabletChange(evt) {
  if (evt.matches) {
    handleEqualSize();
  }
};

mediaQuery.addEventListener('change', handleTabletChange);
handleTabletChange(mediaQuery);
