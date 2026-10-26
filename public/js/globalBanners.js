((B, a, N, n, E, r, S) => {
    //
    let parentObj = document.currentScript.dataset["parent"] || "body";
    const customCss = document.currentScript.dataset["customcss"] || "";
    // console.log('bannersParent', parentObj, document.currentScript.dataset);
    //
    const bannerStyles = `@media (min-width:768px){.mobile-show{display:none!important}}@media (max-width:767px){.mobile-hide{display:none!important}}.textNowrap{white-space:nowrap;}.holiday-bar,.holiday-bar-regular{min-height:48px;color:#fff}.holiday-bar img{filter:drop-shadow(1px 1px 5px rgba(0, 0, 0, .9))}.holiday-bar.resort-clearance{background-color:#fffe5c}.holiday-bar.resort-clearance .holiday-bar__icon{margin-right:0}.holiday-bar.resort-clearance img{height:45px;filter:drop-shadow(1px 1px 10px rgba(0, 0, 0, .5))}.holiday-bar.bf,.holiday-bar.bfe,.holiday-bar.newyeare,.holiday-bar.newyearsavenow{background-color:#000000f0;box-shadow:inset 0 0 20px 4px rgba(0,0,0,.5)}.holiday-bar.cs,.holiday-bar.cse{background-color:#206fee;box-shadow:inset 0 0 20px 4px rgb(0 0 0 / 17%)}.holiday-bar.xmas,.holiday-bar.xmas-savenow,.holiday-bar.xmase{background-color:#c90d0d;box-shadow:inset 0 0 20px 4px rgb(0 0 0 / 17%)}.holiday-bar-regular__inner,.holiday-bar__inner{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center}.holiday-bar__icon{margin-right:15px;margin-bottom:-12px}.holiday-bar__text{padding:10px 0;font-family:Montserrat,sans-serif;font-weight:700;font-size:20px;line-height:1.1em}.holiday-bar__text .accent{color:#fff25d}.holiday-bar__text .accent-mtt{font-weight:500}.holiday-bar-regular .line-2,.holiday-bar-regular__text{font-family:Montserrat,sans-serif;font-weight:700;font-size:25px;line-height:1.1em}.holiday-bar-regular{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;background-color:#ee1e27}.holiday-bar-regular__icon{position:relative;top:-1px;margin-right:15px;margin-bottom:-12px}.holiday-bar-regular__text{padding:10px 0}.holiday-bar-regular__text .accent{color:#d2fe6b}.holiday-bar-regular__text small{font-size:19px}.holiday-bar-regular .line-1,.holiday-bar-regular .line-2{margin:0 5px}.holiday-bar-regular .line-2 small{display:block;font-size:19px;line-height:1.1em}@media (max-width:991px){.holiday-bar-regular{-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column}.holiday-bar-regular .line-1{margin-bottom:-8px}.holiday-bar-regular__icon{top:-6px}.holiday-bar-regular__icon img{max-width:70px}}@media (max-width:767px){.holiday-bar{padding:0 15px}.holiday-bar.resort-clearance img{width:100%;height:auto!important;margin-top:5px}.holiday-bar.resort-clearance .holiday-bar__icon{margin-right:0}.holiday-bar__icon{margin-bottom:0}.holiday-bar__text{padding:15px 0;font-size:18px;letter-spacing:-.5px}.holiday-bar__text .accent-mtt{font-size:16px;font-weight:500}.holiday-bar-regular{padding:0 9px 13px}.holiday-bar-regular .line-1,.holiday-bar-regular .line-2{margin:0;text-align:center}.holiday-bar-regular__icon{top:0;margin-right:5px;margin-bottom:0}.holiday-bar-regular__icon img{max-width:54px}.holiday-bar-regular__text{padding:15px 0 8px;font-size:19px}.holiday-bar-regular .line-1{margin-bottom:-5px}.holiday-bar-regular .line-2 small{font-size:13px}}`;
    //
    const styles = a.createElement('style');
    styles.innerHTML = bannerStyles;
    if (customCss) {
        styles.innerHTML += "   " + customCss;
    }
    a.head.prepend(styles);
    //
    const bannersArr = {
        bf: {
            name: "bf",
            start: "2026-11-01",
            end: "2026-11-28",
            image: "https://assets.myonedash.com/images/global-banners/holiday-bar-icon-bf1.png",
            text: "BLACK FRIDAY SALE <br class=\"mobile-show\"><span class=\"accent\">STARTS NOW!</span>"
        },
        bfe: {
            name: "bfe",
            start: "2026-11-01",
            end: "2026-11-27",
            image: "https://assets.myonedash.com/images/global-banners/holiday-bar-icon-bf2.png",
            text: "BLACK FRIDAY SALE <br class=\"mobile-show\"><span class=\"accent\">ENDS SOON!</span>"
        },
        cs: {
            name: "cs",
            start: "2026-11-28",
            end: "2026-11-30",
            image: "https://assets.myonedash.com/images/global-banners/holiday-bar-icon-cs.png",
            text: "CYBER SALE <br class=\"mobile-show\"><span class=\"accent\">STARTS NOW!</span>"
        },
        cse: {
            name: "cse",
            start: "2026-12-01",
            end: "2026-12-04",
            image: "https://assets.myonedash.com/images/global-banners/holiday-bar-icon-cs.png",
            text: "CYBER SALE <br class=\"mobile-show\"><span class=\"accent\">ENDS SOON!</span>"
        },
        xmas: {
            name: "xmas",
            start: "2026-12-05",
            end: "2026-12-12",
            image: "https://assets.myonedash.com/images/global-banners/holiday-bar-icon-xmas1.png",
            text: "CHRISTMAS MIRACLE <span class=\"mobile-show\"><span class=\"accent textNowrap\">VACATION SALE!</span></span><span class=\"mobile-hide\"> DEAL<br><span class=\"accent\">HAPPENING NOW!</span></span>"
        },
        xmase: {
            name: "xmase",
            start: "2026-12-12",
            end: "2026-12-12",
            image: "https://assets.myonedash.com/images/global-banners/holiday-bar-icon-xmas2.png",
            text: "CHRISTMAS MIRACLE DEAL <br class=\"mobile-show\"><span class=\"accent\">ENDS SOON!</span>"
        },
        newyearsavenow: {
            name: "newyearsavenow",
            start: "2026-12-12",
            end: "2027-01-04",
            image: "https://assets.myonedash.com/images/global-banners/holiday-bar-icon-newyear.png",
            text: "NEW YEAR SALE <br class=\"mobile-show\"><span class=\"accent\">HAPPENING NOW!</span>" //  <br class=\"mobile-show\"><span class=\"accent-mtt\">Take up to {$months_to_travel} Months to Travel!</span>
        },
        newyeare: {
            name: "newyeare",
            start: "2027-01-05",
            end: "2027-01-12",
            image: "https://assets.myonedash.com/images/global-banners/holiday-bar-icon-newyear.png",
            text: "NEW YEAR SALE <br class=\"mobile-show\"><span class=\"accent\">ENDS SOON!</span>"
        },
    };
    //
    const selectedBanner = findActiveBanner(bannersArr);
    if (selectedBanner) {
        const bannerTemplate = `<div class="holiday-bar ${selectedBanner["name"]}"><div class="holiday-bar__inner"><div class="holiday-bar__icon"><img src="${selectedBanner["image"]}" alt=""></div><div class="holiday-bar__text">${selectedBanner["text"]}</div></div></div>`;
        const wrapper = a.createElement('div');
        wrapper.innerHTML = bannerTemplate;
        // console.log(a.querySelector(parentObj));
        if (!parentObj) parentObj = "body";
        a.querySelector(parentObj).prepend(wrapper);
    }
    //
    //
    function findActiveBanner(banners) {
        // Get today's date and set it to midnight for accurate comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTime = today.getTime();

        for (const key in banners) {
            if (banners.hasOwnProperty(key)) {
                const banner = banners[key];

                // Parse "YYYY-MM-DD" as local midnight. A bare date string parses as
                // midnight UTC, which in US time zones is the previous evening and
                // would end every banner a day early.
                const startDate = new Date(banner.start + "T00:00:00");
                const endDate = new Date(banner.end + "T00:00:00");

                // Set the end date to the *end* of the day (23:59:59.999)
                // so the end date is inclusive.
                endDate.setHours(23, 59, 59, 999);

                // Check if today's time is greater than or equal to the start time
                // AND less than or equal to the end time.
                if (todayTime >= startDate.getTime() && todayTime <= endDate.getTime()) {
                    return banner; // Found the active banner
                }
            }
        }

        return null; // No active banner found
    }
})(window, document, 'script');
