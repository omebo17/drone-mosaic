"use strict";
(self["webpackChunkdronemosaic"] = self["webpackChunkdronemosaic"] || []).push([["main"],{

/***/ 158:
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AppRoutingModule": () => (/* binding */ AppRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 124);
/* harmony import */ var _homepage_homepage_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./homepage/homepage.component */ 4877);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 2560);




const routes = [
    { path: '', component: _homepage_homepage_component__WEBPACK_IMPORTED_MODULE_0__.HomepageComponent },
    { path: '**', redirectTo: '' }
];
class AppRoutingModule {
}
AppRoutingModule.ɵfac = function AppRoutingModule_Factory(t) { return new (t || AppRoutingModule)(); };
AppRoutingModule.ɵmod = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineNgModule"]({ type: AppRoutingModule });
AppRoutingModule.ɵinj = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjector"]({ imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule.forRoot(routes), _angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsetNgModuleScope"](AppRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule] }); })();


/***/ }),

/***/ 5041:
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AppComponent": () => (/* binding */ AppComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 2560);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 124);
/* harmony import */ var _header_menu_header_menu_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./header-menu/header-menu.component */ 8379);



class AppComponent {
    constructor() {
        this.title = 'dronemosaic';
    }
}
AppComponent.ɵfac = function AppComponent_Factory(t) { return new (t || AppComponent)(); };
AppComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: AppComponent, selectors: [["app-root"]], decls: 4, vars: 0, consts: [[2, "display", "none"]], template: function AppComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "app-header-menu")(1, "router-outlet");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Custom app component loaded");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    } }, dependencies: [_angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterOutlet, _header_menu_header_menu_component__WEBPACK_IMPORTED_MODULE_0__.HeaderMenuComponent], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJhcHAuY29tcG9uZW50LmNzcyJ9 */"] });


/***/ }),

/***/ 6747:
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AppModule": () => (/* binding */ AppModule)
/* harmony export */ });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/platform-browser */ 4497);
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app.component */ 5041);
/* harmony import */ var _homepage_homepage_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./homepage/homepage.component */ 4877);
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app-routing.module */ 158);
/* harmony import */ var _header_menu_header_menu_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./header-menu/header-menu.component */ 8379);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 2560);






class AppModule {
}
AppModule.ɵfac = function AppModule_Factory(t) { return new (t || AppModule)(); };
AppModule.ɵmod = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineNgModule"]({ type: AppModule, bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_0__.AppComponent] });
AppModule.ɵinj = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineInjector"]({ imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_5__.BrowserModule,
        _app_routing_module__WEBPACK_IMPORTED_MODULE_2__.AppRoutingModule] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵsetNgModuleScope"](AppModule, { declarations: [_app_component__WEBPACK_IMPORTED_MODULE_0__.AppComponent,
        _homepage_homepage_component__WEBPACK_IMPORTED_MODULE_1__.HomepageComponent,
        _header_menu_header_menu_component__WEBPACK_IMPORTED_MODULE_3__.HeaderMenuComponent], imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_5__.BrowserModule,
        _app_routing_module__WEBPACK_IMPORTED_MODULE_2__.AppRoutingModule] }); })();


/***/ }),

/***/ 8379:
/*!******************************************************!*\
  !*** ./src/app/header-menu/header-menu.component.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HeaderMenuComponent": () => (/* binding */ HeaderMenuComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 2560);

class HeaderMenuComponent {
    constructor() {
        this.activeSection = 'home';
        this.isScrollingProgrammatically = false;
    }
    ngOnInit() {
        this.updateActiveSection();
    }
    onScroll() {
        // Don't update active section if we're programmatically scrolling
        if (this.isScrollingProgrammatically) {
            return;
        }
        // Debounce scroll events
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => {
            this.updateActiveSection();
        }, 100);
    }
    updateActiveSection() {
        const scrollY = window.scrollY;
        const homeSection = document.getElementById('home-section');
        const aboutSection = document.getElementById('about-section');
        if (homeSection && aboutSection) {
            const aboutTop = aboutSection.offsetTop - 100; // 100px offset for header
            if (scrollY >= aboutTop) {
                this.activeSection = 'about';
            }
            else {
                this.activeSection = 'home';
            }
        }
    }
    scrollToSection(sectionId) {
        const sectionName = sectionId.replace('-section', '');
        console.log('Attempting to scroll to:', sectionId, 'Current active:', this.activeSection);
        // Set flag to prevent scroll listener from interfering
        this.isScrollingProgrammatically = true;
        // Update active section immediately
        this.activeSection = sectionName;
        // Custom smooth scroll function
        const smoothScrollTo = (targetY) => {
            const startY = window.pageYOffset;
            const distance = targetY - startY;
            const duration = 800; // milliseconds
            let start;
            const step = (timestamp) => {
                if (!start)
                    start = timestamp;
                const progress = Math.min((timestamp - start) / duration, 1);
                const ease = progress < 0.5
                    ? 2 * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2; // easeInOutQuad
                window.scrollTo(0, startY + distance * ease);
                if (progress < 1) {
                    requestAnimationFrame(step);
                }
                else {
                    // Re-enable scroll listener after animation completes
                    setTimeout(() => {
                        this.isScrollingProgrammatically = false;
                    }, 100);
                }
            };
            requestAnimationFrame(step);
        };
        const element = document.getElementById(sectionId);
        console.log('Element found:', element);
        if (element) {
            console.log('Scrolling to element:', element);
            // Calculate target position
            let targetY;
            if (sectionId === 'home-section') {
                targetY = 0;
            }
            else {
                targetY = element.offsetTop - 90; // Account for fixed header
            }
            // Use custom smooth scroll
            smoothScrollTo(targetY);
            console.log('Updated active section to:', this.activeSection);
        }
        else {
            console.log('Element not found for ID:', sectionId);
            // Re-enable scroll listener if element not found
            this.isScrollingProgrammatically = false;
        }
    }
    getNavLinkClass(section) {
        const isActive = this.activeSection === section;
        const baseClasses = 'text-xl font-sans transition-colors cursor-pointer';
        if (isActive) {
            return `${baseClasses} text-gold border-b border-gold pb-1`;
        }
        else {
            return `${baseClasses} text-white hover:text-gold`;
        }
    }
}
HeaderMenuComponent.ɵfac = function HeaderMenuComponent_Factory(t) { return new (t || HeaderMenuComponent)(); };
HeaderMenuComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: HeaderMenuComponent, selectors: [["app-header-menu"]], hostBindings: function HeaderMenuComponent_HostBindings(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("scroll", function HeaderMenuComponent_scroll_HostBindingHandler($event) { return ctx.onScroll($event); }, false, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresolveWindow"]);
    } }, decls: 21, vars: 4, consts: [[1, "fixed", "top-0", "w-full", "bg-[#121414]", "h-[90px]", "md:h-[90px]", "sm:h-[50px]", "flex", "items-center", "justify-between", "px-[260px]", "z-50"], [1, "flex", "flex-col", "items-center", "space-y-1"], ["src", "assets/images/droneLogo.svg", "alt", "DroneMosaic Logo", 1, "h-8", "w-auto"], [1, "font-serif", "text-white", "text-lg", "leading-7", "hover:text-gold", "transition-colors", "cursor-pointer"], [1, "hidden", "md:flex", "items-center", "space-x-8"], ["href", "#", 1, "text-xl", "font-sans", "transition-colors", "cursor-pointer", 3, "click"], ["href", "#", 1, "text-white", "text-xl", "font-sans", "hover:text-gold", "transition-colors"], [1, "border", "border-gray-300", "text-white", "px-4", "py-2", "text-sm", "font-sans", "hover:bg-gold", "transition-colors", "rounded-md"], [1, "md:hidden", "text-white"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-6", "h-6"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M4 6h16M4 12h16M4 18h16"]], template: function HeaderMenuComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "header", 0)(1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "img", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, " Drone Mosaic ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "nav", 4)(6, "a", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function HeaderMenuComponent_Template_a_click_6_listener() { return ctx.scrollToSection("home-section"); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Home");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "a", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function HeaderMenuComponent_Template_a_click_8_listener() { return ctx.scrollToSection("about-section"); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "About");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "a", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "Services");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "a", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "Pricing");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "a", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "How It Works");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "button", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, " Contact ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "button", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "svg", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](20, "path", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassMap"](ctx.getNavLinkClass("home"));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassMap"](ctx.getNavLinkClass("about"));
    } }, styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJoZWFkZXItbWVudS5jb21wb25lbnQuY3NzIn0= */"] });


/***/ }),

/***/ 4877:
/*!************************************************!*\
  !*** ./src/app/homepage/homepage.component.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HomepageComponent": () => (/* binding */ HomepageComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 2560);

class HomepageComponent {
    constructor() { }
    ngOnInit() {
    }
    onScroll(event) {
        const scrollY = window.scrollY;
        const heroContent = document.querySelector('.hero-content');
        const servicesContent = document.querySelector('.services-content');
        // Hero section parallax
        if (heroContent) {
            // Slower parallax effect
            const parallaxSpeed = 0.8;
            heroContent.style.transform = `translateY(${-scrollY * parallaxSpeed}px)`;
            // Opacity changes based on scroll position
            const fadeStart = 50;
            const fadeEnd = 300;
            if (scrollY <= fadeStart) {
                // Full opacity when at top
                heroContent.style.opacity = '1';
            }
            else if (scrollY <= fadeEnd) {
                // Fade out as scrolling down
                const opacity = Math.max(0, Math.min(1, (fadeEnd - scrollY) / (fadeEnd - fadeStart)));
                heroContent.style.opacity = opacity.toString();
            }
            else {
                // Fade back in when scrolling up from below fadeEnd
                const opacity = Math.max(0, Math.min(1, (scrollY - fadeEnd + 100) / 100));
                heroContent.style.opacity = opacity.toString();
            }
        }
        // Services section parallax
        if (servicesContent) {
            const aboutSection = document.getElementById('about-section');
            if (aboutSection) {
                const aboutTop = aboutSection.offsetTop;
                const servicesStart = aboutTop + 200; // Start parallax when services section comes into view
                const servicesEnd = aboutTop + 600; // Reduced end point to prevent extra scroll
                if (scrollY >= servicesStart && scrollY <= servicesEnd) {
                    // Parallax effect: move content slower than scroll with limited movement
                    const parallaxSpeed = 0.2; // Reduced speed
                    const relativeScroll = scrollY - servicesStart;
                    const maxMovement = 80; // Limit maximum movement
                    const movement = Math.min(relativeScroll * parallaxSpeed, maxMovement);
                    servicesContent.style.transform = `translateY(${movement}px)`;
                    // Fade in effect as section comes into view
                    const fadeProgress = Math.min(1, (scrollY - servicesStart) / 200);
                    servicesContent.style.opacity = fadeProgress.toString();
                }
                else if (scrollY > servicesEnd) {
                    // Keep final position (limited)
                    servicesContent.style.transform = `translateY(80px)`; // Fixed maximum
                    servicesContent.style.opacity = '1';
                }
                else {
                    // Reset when above services section
                    servicesContent.style.transform = 'translateY(0px)';
                    servicesContent.style.opacity = '0';
                }
            }
        }
    }
}
HomepageComponent.ɵfac = function HomepageComponent_Factory(t) { return new (t || HomepageComponent)(); };
HomepageComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: HomepageComponent, selectors: [["app-homepage"]], hostBindings: function HomepageComponent_HostBindings(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("scroll", function HomepageComponent_scroll_HostBindingHandler($event) { return ctx.onScroll($event); }, false, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresolveWindow"]);
    } }, decls: 120, vars: 0, consts: [["id", "home-section"], [1, "hero-background", "relative", "w-full", "h-[100vh]", "md:mt-[90px]", "sm:mt-[50px]", 2, "background-image", "url('assets/images/drones.png')"], [1, "hero-content", "absolute", "top-[300px]", "sm:left-20", "space-y-6"], [1, "text-white", "font-sans", "text-6xl", "md:text-6xl", "sm:text-4xl", "font-bold", "leading-tight", "drop-shadow-lg"], [1, "text-white", "font-sans", "text-2xl", "md:text-2xl", "sm:text-xl", "font-normal", "drop-shadow-md"], [1, "bg-gold", "text-white", "font-sans", "text-lg", "px-8", "py-4", "rounded-md", "hover:bg-opacity-90", "shadow-lg"], ["id", "about-section", 1, "bg-black", "w-full", "py-20", "px-8", "md:px-16", "lg:px-24"], [1, "max-w-7xl", "mx-auto"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-12", "lg:gap-16", "items-center"], [1, "space-y-8"], [1, "text-white", "font-sans", "text-4xl", "md:text-5xl", "lg:text-6xl", "font-bold", "leading-tight"], [1, "text-white", "font-sans", "text-xl", "md:text-2xl", "font-normal"], [1, "text-white", "font-sans", "text-base", "md:text-lg", "leading-relaxed"], [1, "border", "border-white", "text-white", "bg-black", "px-8", "py-4", "text-lg", "font-sans", "rounded-md", "hover:bg-gold", "hover:text-white", "transition-all", "duration-300"], [1, "relative"], ["src", "assets/images/showExample1.png", "alt", "Illuminated drones flying over city at night", 1, "w-full", "h-auto", "rounded-lg", "shadow-2xl"], [1, "absolute", "inset-0", "bg-gradient-to-t", "from-black/20", "to-transparent", "rounded-lg"], [1, "w-full", "pt-20", "pb-32", "px-8", "md:px-16", "lg:px-24", 2, "background", "linear-gradient(180deg, #000000 0%, #121414 70%, rgba(193, 153, 87, 0.7) 100%)"], [1, "max-w-7xl", "mx-auto", "services-content"], [1, "text-center", "mb-16"], [1, "text-gold", "font-sans", "text-4xl", "md:text-5xl", "lg:text-6xl", "font-bold", "mb-4"], [1, "text-gold", "font-sans", "text-xl", "md:text-2xl"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-8", "lg:gap-12"], [1, "service-card", "bg-[#121414]", "rounded-lg", "overflow-hidden", "shadow-lg", "m-1"], ["src", "assets/images/showExample2.png", "alt", "Custom drone show experience", 1, "w-full", "h-48", "object-cover"], [1, "absolute", "inset-0", "bg-gradient-to-t", "from-black/50", "to-transparent"], [1, "p-6"], [1, "text-white", "font-sans", "text-xl", "font-bold", "mb-3"], [1, "text-gray-300", "font-sans", "text-base", "leading-relaxed"], ["src", "assets/images/showExample3.png", "alt", "Drone show packages", 1, "w-full", "h-48", "object-cover"], ["src", "assets/images/showExample4.png", "alt", "Seamless booking experience", 1, "w-full", "h-48", "object-cover"], [1, "bg-black", "w-full", "py-16", "px-8", "md:px-16", "lg:px-24"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-4", "gap-8", "mb-12"], [1, "lg:col-span-2"], [1, "flex", "flex-col", "items-center", "lg:items-start", "space-y-4"], [1, "flex", "flex-col", "items-center", "lg:items-start", "space-y-2"], ["src", "assets/images/droneLogo.svg", "alt", "DroneMosaic Logo", 1, "h-10", "w-auto"], [1, "font-serif", "text-white", "text-2xl", "font-bold"], [1, "text-gray-400", "font-sans", "text-base", "leading-relaxed", "text-center", "lg:text-left", "max-w-md"], [1, "text-white", "font-sans", "text-lg", "font-bold", "mb-4"], [1, "space-y-3"], ["href", "#", 1, "text-gray-400", "font-sans", "text-sm", "hover:text-gold", "transition-colors"], [1, "text-gray-400", "font-sans", "text-sm"], [1, "flex", "space-x-4", "mt-4"], ["href", "#", 1, "text-gray-400", "hover:text-gold", "transition-colors"], ["fill", "currentColor", "viewBox", "0 0 24 24", 1, "w-5", "h-5"], ["d", "M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"], ["d", "M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"], ["d", "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"], [1, "border-t", "border-gray-800", "pt-8"], [1, "flex", "flex-col", "md:flex-row", "justify-between", "items-center", "space-y-4", "md:space-y-0"], [1, "flex", "space-x-6"]], template: function HomepageComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1)(2, "div", 2)(3, "h1", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, " Spectacular droneshows ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "h2", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, " Elevate your event with drones ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "button", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, " View services ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "section", 6)(10, "div", 7)(11, "div", 8)(12, "div", 9)(13, "h2", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14, " Elevate your events ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "h3", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, " Unforgettable drone light shows ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "p", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](18, " At Droneshow Services, we specialize in crafting breathtaking drone light shows that transform ordinary events into extraordinary experiences. Our team combines cutting-edge technology with artistic creativity to deliver mesmerizing aerial performances, whether for weddings, corporate events, or public celebrations. Each show is tailored to your vision, ensuring that your event stands out and leaves a lasting impression. Let us light up the night sky and elevate your event to new heights! ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "button", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, " Get in touch ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "div", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](22, "img", 15)(23, "div", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "section", 17)(25, "div", 18)(26, "div", 19)(27, "h2", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](28, " Spectacular drone shows ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "p", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](30, " Unforgettable experiences for any event! ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "div", 22)(32, "div", 23)(33, "div", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](34, "img", 24)(35, "div", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](36, "div", 26)(37, "h3", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](38, " Custom drone show experience ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](39, "p", 28);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](40, " Create a unique aerial spectacle tailored to your vision. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](41, "div", 23)(42, "div", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](43, "img", 29)(44, "div", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](45, "div", 26)(46, "h3", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](47, " Drone show packages ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](48, "p", 28);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](49, " Choose from various packages to suit your event size. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](50, "div", 23)(51, "div", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](52, "img", 30)(53, "div", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](54, "div", 26)(55, "h3", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](56, " Seamless booking experience ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](57, "p", 28);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](58, " Effortlessly book your drone show with us. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](59, "footer", 31)(60, "div", 7)(61, "div", 32)(62, "div", 33)(63, "div", 34)(64, "div", 35);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](65, "img", 36);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](66, "div", 37);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](67, " Drone Mosaic ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](68, "p", 38);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](69, " Creating spectacular drone light shows that transform ordinary events into extraordinary experiences. Let us light up your night sky. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](70, "div")(71, "h3", 39);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](72, "Quick Links");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](73, "ul", 40)(74, "li")(75, "a", 41);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](76, "Home");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](77, "li")(78, "a", 41);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](79, "About");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](80, "li")(81, "a", 41);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](82, "Services");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](83, "li")(84, "a", 41);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](85, "Pricing");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](86, "li")(87, "a", 41);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](88, "How It Works");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](89, "div")(90, "h3", 39);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](91, "Contact");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](92, "ul", 40)(93, "li", 42);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](94, "info@dronemosaic.com");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](95, "li", 42);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](96, "+1 (555) 123-4567");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](97, "li", 42);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](98, "Available 24/7");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](99, "div", 43)(100, "a", 44);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](101, "svg", 45);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](102, "path", 46);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](103, "a", 44);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](104, "svg", 45);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](105, "path", 47);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](106, "a", 44);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](107, "svg", 45);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](108, "path", 48);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](109, "div", 49)(110, "div", 50)(111, "div", 42);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](112, " \u00A9 2025 Drone Mosaic. All rights reserved. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](113, "div", 51)(114, "a", 41);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](115, "Privacy Policy");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](116, "a", 41);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](117, "Terms of Service");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](118, "a", 41);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](119, "Cookie Policy");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()()();
    } }, styles: [".hero-background[_ngcontent-%COMP%] {\r\n  background-size: cover;\r\n  background-position: bottom;\r\n  background-repeat: no-repeat;\r\n  background-attachment: scroll;\r\n  overflow-x: hidden;\r\n}\r\n\r\n.hero-background[_ngcontent-%COMP%]::before {\r\n  content: '';\r\n  position: absolute;\r\n  top: 0;\r\n  left: 0;\r\n  right: 0;\r\n  bottom: 0;\r\n  background-color: rgba(0, 0, 0, 0.3);\r\n  z-index: 1;\r\n}\r\n.hero-content[_ngcontent-%COMP%] {\r\n  position: relative;\r\n  z-index: 2;\r\n}\r\n\r\nbutton[_ngcontent-%COMP%] {\r\n  transition: all 0.3s ease;\r\n}\r\nbutton[_ngcontent-%COMP%]:hover {\r\n  transform: translateY(-2px);\r\n  box-shadow: 0 12px 35px rgba(193, 153, 87, 0.6), 0 6px 15px rgba(193, 153, 87, 0.4);\r\n}\r\n\r\nbutton.border.border-white[_ngcontent-%COMP%]:hover {\r\n  box-shadow: 0 12px 35px rgba(193, 153, 87, 0.7), 0 6px 15px rgba(193, 153, 87, 0.5);\r\n}\r\n\r\n.service-card[_ngcontent-%COMP%] {\r\n  transform-origin: center;\r\n  transition: transform 0.3s ease, box-shadow 0.3s ease;\r\n}\r\n.service-card[_ngcontent-%COMP%]:hover {\r\n  transform: scale(1.02);\r\n  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);\r\n}\r\n\r\n.hero-content[_ngcontent-%COMP%] {\r\n  transition: opacity 0.3s ease-out;\r\n  will-change: transform, opacity;\r\n}\r\n\r\n.services-content[_ngcontent-%COMP%] {\r\n  transition: transform 0.1s ease-out, opacity 0.3s ease-out;\r\n  will-change: transform, opacity;\r\n  overflow: hidden;\r\n}\r\n\r\nsection[_ngcontent-%COMP%] {\r\n  overflow-x: hidden;\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhvbWVwYWdlLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsc0NBQXNDO0FBQ3RDO0VBQ0Usc0JBQXNCO0VBQ3RCLDJCQUEyQjtFQUMzQiw0QkFBNEI7RUFDNUIsNkJBQTZCO0VBQzdCLGtCQUFrQjtBQUNwQjtBQUVBLHlCQUF5QjtBQUN6QjtFQUNFLFdBQVc7RUFDWCxrQkFBa0I7RUFDbEIsTUFBTTtFQUNOLE9BQU87RUFDUCxRQUFRO0VBQ1IsU0FBUztFQUNULG9DQUFvQztFQUNwQyxVQUFVO0FBQ1o7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQixVQUFVO0FBQ1o7QUFFQSx1QkFBdUI7QUFDdkI7RUFDRSx5QkFBeUI7QUFDM0I7QUFFQTtFQUNFLDJCQUEyQjtFQUMzQixtRkFBbUY7QUFDckY7QUFFQSw2Q0FBNkM7QUFDN0M7RUFDRSxtRkFBbUY7QUFDckY7QUFFQSx3REFBd0Q7QUFDeEQ7RUFDRSx3QkFBd0I7RUFDeEIscURBQXFEO0FBQ3ZEO0FBRUE7RUFDRSxzQkFBc0I7RUFDdEIsMENBQTBDO0FBQzVDO0FBRUEsZ0NBQWdDO0FBQ2hDO0VBQ0UsaUNBQWlDO0VBQ2pDLCtCQUErQjtBQUNqQztBQUVBLDhCQUE4QjtBQUM5QjtFQUNFLDBEQUEwRDtFQUMxRCwrQkFBK0I7RUFDL0IsZ0JBQWdCO0FBQ2xCO0FBRUEsb0RBQW9EO0FBQ3BEO0VBQ0Usa0JBQWtCO0FBQ3BCIiwiZmlsZSI6ImhvbWVwYWdlLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBPcHRpbWl6ZSBiYWNrZ3JvdW5kIGltYWdlIGxvYWRpbmcgKi9cclxuLmhlcm8tYmFja2dyb3VuZCB7XHJcbiAgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcclxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBib3R0b207XHJcbiAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcclxuICBiYWNrZ3JvdW5kLWF0dGFjaG1lbnQ6IHNjcm9sbDtcclxuICBvdmVyZmxvdy14OiBoaWRkZW47XHJcbn1cclxuXHJcbi8qIFByZWxvYWQgb3B0aW1pemF0aW9uICovXHJcbi5oZXJvLWJhY2tncm91bmQ6OmJlZm9yZSB7XHJcbiAgY29udGVudDogJyc7XHJcbiAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gIHRvcDogMDtcclxuICBsZWZ0OiAwO1xyXG4gIHJpZ2h0OiAwO1xyXG4gIGJvdHRvbTogMDtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMyk7XHJcbiAgei1pbmRleDogMTtcclxufVxyXG5cclxuLmhlcm8tY29udGVudCB7XHJcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gIHotaW5kZXg6IDI7XHJcbn1cclxuXHJcbi8qIFNtb290aCB0cmFuc2l0aW9ucyAqL1xyXG5idXR0b24ge1xyXG4gIHRyYW5zaXRpb246IGFsbCAwLjNzIGVhc2U7XHJcbn1cclxuXHJcbmJ1dHRvbjpob3ZlciB7XHJcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0ycHgpO1xyXG4gIGJveC1zaGFkb3c6IDAgMTJweCAzNXB4IHJnYmEoMTkzLCAxNTMsIDg3LCAwLjYpLCAwIDZweCAxNXB4IHJnYmEoMTkzLCAxNTMsIDg3LCAwLjQpO1xyXG59XHJcblxyXG4vKiBTcGVjaWZpYyBzdHlsaW5nIGZvciBHZXQgaW4gdG91Y2ggYnV0dG9uICovXHJcbmJ1dHRvbi5ib3JkZXIuYm9yZGVyLXdoaXRlOmhvdmVyIHtcclxuICBib3gtc2hhZG93OiAwIDEycHggMzVweCByZ2JhKDE5MywgMTUzLCA4NywgMC43KSwgMCA2cHggMTVweCByZ2JhKDE5MywgMTUzLCA4NywgMC41KTtcclxufVxyXG5cclxuLyogU2VydmljZSBjYXJkcyBob3ZlciBlZmZlY3Qgd2l0aCBvdmVyZmxvdyBwcmV2ZW50aW9uICovXHJcbi5zZXJ2aWNlLWNhcmQge1xyXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcclxuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlLCBib3gtc2hhZG93IDAuM3MgZWFzZTtcclxufVxyXG5cclxuLnNlcnZpY2UtY2FyZDpob3ZlciB7XHJcbiAgdHJhbnNmb3JtOiBzY2FsZSgxLjAyKTtcclxuICBib3gtc2hhZG93OiAwIDIwcHggNDBweCByZ2JhKDAsIDAsIDAsIDAuMyk7XHJcbn1cclxuXHJcbi8qIFNtb290aCBwYXJhbGxheCB0cmFuc2l0aW9ucyAqL1xyXG4uaGVyby1jb250ZW50IHtcclxuICB0cmFuc2l0aW9uOiBvcGFjaXR5IDAuM3MgZWFzZS1vdXQ7XHJcbiAgd2lsbC1jaGFuZ2U6IHRyYW5zZm9ybSwgb3BhY2l0eTtcclxufVxyXG5cclxuLyogU2VydmljZXMgc2VjdGlvbiBwYXJhbGxheCAqL1xyXG4uc2VydmljZXMtY29udGVudCB7XHJcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuMXMgZWFzZS1vdXQsIG9wYWNpdHkgMC4zcyBlYXNlLW91dDtcclxuICB3aWxsLWNoYW5nZTogdHJhbnNmb3JtLCBvcGFjaXR5O1xyXG4gIG92ZXJmbG93OiBoaWRkZW47XHJcbn1cclxuXHJcbi8qIFByZXZlbnQgaG9yaXpvbnRhbCBzY3JvbGwgZnJvbSBwYXJhbGxheCBlZmZlY3RzICovXHJcbnNlY3Rpb24ge1xyXG4gIG92ZXJmbG93LXg6IGhpZGRlbjtcclxufVxyXG4iXX0= */"] });


/***/ }),

/***/ 2340:
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "environment": () => (/* binding */ environment)
/* harmony export */ });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ 4431:
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser */ 4497);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 2560);
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app/app.module */ 6747);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./environments/environment */ 2340);




if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.production) {
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.enableProdMode)();
}
_angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__.platformBrowser().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_0__.AppModule)
    .catch(err => console.error(err));


/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendor"], () => (__webpack_exec__(4431)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=main.js.map