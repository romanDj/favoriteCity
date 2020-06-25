/** Slider cards **/
(function ($) {
    jQuery.fn.sliderCards = function (options) {
        var init = function () {
            var page_current = 1;
            var page_count = 1;
            var card_width = 0;
            var card_count = 0;
            var card_in_page_count = 0;
            var card_margin = 0;
            var container_width = 0;
            var container_height = 0;
            var count_row = 1;

            function _initial() {
                try {
                    var el = $(this).find('*[data-type="slider-content"]');
                    page_current = 0;
                    card_count = el.children().length;
                    container_width = el.width();
                    card_width = el.children().first().width();
                    card_in_page_count = Math.floor(container_width / card_width);
                    container_height = el.height();
                    count_row = Math.floor(container_height / el.children().first().height());

                    if (card_in_page_count * count_row < card_count) {
                        page_count = Math.ceil((Math.floor(card_count / card_in_page_count / count_row) * count_row + card_count) / card_in_page_count / count_row);
                    }

                    card_margin = Number(el.css('column-gap').replace('px', '')) || 0;
                } catch (e) {
                    console.log(e);
                }
            }

            function _updateControls() {
                if (page_current == 0) {
                    $(this).find('*[data-type="slider-btn-prev"]').prop('disabled', true);
                } else {
                    $(this).find('*[data-type="slider-btn-prev"]').prop('disabled', false);
                }
                if (page_current + 1 == page_count || page_count == 1) {
                    $(this).find('*[data-type="slider-btn-next"]').prop('disabled', true);
                } else {
                    $(this).find('*[data-type="slider-btn-next"]').prop('disabled', false);
                }
            }

            function _updateSlides() {
                try {
                    var el = $(this).find('*[data-type="slider-content"]');
                    var index = (card_in_page_count - 1) * page_current;
                    if (index < 0) {
                        index = 0;
                    }
                    var position = index * card_width + index * card_margin;
                    el.css({
                        'left': '-' + position + 'px'
                    });
                } catch (e) {
                    console.log(e);
                }
            }


            var initial = _initial.bind(this);
            var updateControls = _updateControls.bind(this);
            var updateSlides = _updateSlides.bind(this);

            initial();
            updateControls();

            $(window).resize(function () {
                initial();
                updateControls();
                updateSlides();
            });

            $(this).find('.slider__control-prev').click(function () {
                page_current -= 1;
                updateControls();
                updateSlides();
            });
            $(this).find('.slider__control-next').click(function () {
                page_current += 1;
                updateSlides();
                updateControls();
            });
        };
        return this.each(init);
    };
})(jQuery);
/** end Slider cards **/

/** Banner for advertising **/
(function ($) {
    jQuery.fn.bannerAdvertising = function (options) {
        var init = async function () {
            var index_max = $(this).find('.banner__content>*:last-child').index();
            var index_cur = index_max + 0;
            if (index_max < 1) {
                return;
            }

            function fadeToggle(elem) {
                return new Promise(function (resolve, reject) {
                    elem.css({'display': 'block'});
                    elem.fadeTo('slow', 1, function () {
                        setTimeout(function () {
                            elem.fadeTo('slow', 0, function () {
                                elem.css({'display': 'none'});
                                resolve();
                            });
                        }, 10000);
                    });
                });
            }

            $(this).find('.banner__content>*').css({'display': 'none', 'opacity': '0'});

            while (true) {
                await fadeToggle($(this).find('.banner__content>*').eq(index_cur));
                index_cur--;
                if (index_cur < 0) {
                    index_cur = index_max + 0;
                }
            }
        };
        return this.each(init);
    };
})(jQuery);
/** end Banner for advertising **/

$(document).ready(function () {
    /** Hover line in menu **/
    var hoverLine = $(".header__menu-hover");
    hoverLine.addClass('header__menu-hover-visible');

    function getPropertyForAnimate(obj) {
        var width = obj.width() + 8;
        var left = obj.position().left + (obj.outerWidth(true) / 2) - width / 2;
        return {width, left};
    }

    function load() {
        var {width, left} = getPropertyForAnimate($(".header__menu-item-curr"));
        hoverLine.width(width).css("left", left).data("origLeft", left).data("origWidth", width);
    }

    load();

    $(".header__menu-item").hover(function () {
        var {width, left} = getPropertyForAnimate($(this));
        //передвигать к наведенному
        hoverLine.stop().animate({
            left: left,
            width: width
        });
    }, function () {
        //передвигать к выделенному
        hoverLine.stop().animate({
            left: hoverLine.data("origLeft"),
            width: hoverLine.data("origWidth")
        });
    });
    $(".header__menu-item").click(function () {
        $(".header__lower-menu-item").removeClass('header__menu-item-curr');
        $(this).addClass('header__menu-item-curr');
        var {width, left} = getPropertyForAnimate($(this));
        hoverLine.data("origLeft", left)
            .data("origWidth", width);
    });

    $(window).resize(function () {
        load();
    });
    /** end Hover line in menu **/

    /** Stick menu **/
    $(window).bind('scroll', function () {
        var navHeight = $('.header__upper').outerHeight();
        if ($(window).scrollTop() > navHeight) {
            $('.main__content').css({
                'padding-top': $('.header__lower').outerHeight() + 'px'
            });
            $('.header__lower').addClass('header__lower-fixed');
        } else {
            $('.main__content').css({'padding-top': '0'});
            $('.header__lower').removeClass('header__lower-fixed');
        }
    });
    /** end Stick menu **/

    $('.header__logo').click(function (e) {
        e.preventDefault();
        if((window.location.pathname == ""
            || window.location.pathname == "/") && !window.location.search){
            $("html, body").stop().animate({scrollTop: 0}, 500, 'swing', function () {});
        }else{
            window.location = "/";
        }
    });

    $('.advert__slider').slick({
        dots: true,
    });
    $('.slider').sliderCards();
    $('.banner').bannerAdvertising();
});