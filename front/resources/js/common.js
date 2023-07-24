const ui = {
    init: function () {
        const _this = this;

        _this.header();
        _this.top();
        _this.tab();
        _this.forms();
        _this.sch();
        _this.etc();
        _this.tooltip.init();
        _this.select.init();
    },
    header: () => {
        let scrolling;
        const $header = $('.header');
        const headerHeight = $header.height();

        $(window).on('scroll', (e) => {
            if ($(this).scrollTop() > headerHeight) {
                $header.addClass('is-focus');
            } else {
                $header.removeClass('is-focus');
            }

            if (!scrolling) {
                $header.addClass('up').css('top', -headerHeight + 'px');
            }

            clearTimeout(scrolling);
            scrolling = setTimeout(() => {
                $header.removeClass('up').css('top', 0);

                scrolling = undefined;
            }, 250);
        });
    },
    sch: () => {
        const $delAll = $('.btn-all-del');
        const $inpSearch = $('input[data-name="search"]');
        const latestidx = $('.sch-latest-list li');

        $delAll.on('click', function () {
            $('.sch-latest-list li').remove();
            $(this).closest('.sch-latest-area').hide();
        });
        // 전체삭제

        const btndel = $('.btn-del');
        $(document).ready(function () {
            var latestitems = $('.sch-latest-list li').length;

            if (latestitems == 0) {
                $('.sch-latest-area').hide();
            }

            btndel.on('click', function () {
                $(this).parent('li').remove();
                var latestitems = $('.sch-latest-list li').length;

                if (latestitems == 0) {
                    $('.sch-latest-area').hide();
                }
            });
        });
        // 최근검색어 없을때

        $inpSearch.on('input', function () {
            if ($inpSearch.val().length >= 1) {
                $('.sch-latest-area').hide();
                $('.sch-auto-area').show();
            } else {
                if ($('.sch-latest-list li').length == 0) {
                    $('.sch-latest-area').hide();
                } else {
                    $('.sch-latest-area').show();
                }
                $('.sch-auto-area').hide();
            }
        });
    },
    top: () => {
        const $btnTop = $('.btn-top');

        $(window).scroll(function () {
            if ($(this).scrollTop() > 50) {
                $('.quick_top').fadeIn();
            } else {
                $('.quick_top').fadeOut();
            }
        });
        $btnTop.on('click', function () {
            $('html, body').animate({ scrollTop: 0 }, 400);
        });
    },
    tab: () => {
        const $tabBtn = $('.tab-button');

        $tabBtn.off('click').on('click', function () {
            var data = $(this).data('target'),
                id = $(this).attr('href'),
                $tab = $(this).parent();
            const _this = $(this);

            if ($tab.hasClass('on')) return false;

            _this.parent().addClass('on').siblings().removeClass('on');
            $(data).addClass('open').siblings().removeClass('open');
            // $(id).addClass('open').siblings().removeClass('open');

            const tabWrap = _this.closest('.tab-wrap');

            if (tabWrap.hasClass('line')) {
                console.log(_this);
            } else if (tabWrap.hasClass('box')) {
                console.log(33);
            } else {
                console.log(11);
            }

            let itemsWidth = $(this).outerWidth(true);
        });
    },
    tooltip: {
        className: {
            wrap: '.tooltip-box',
            btn: '.tooltip-btn',
            active: '.on',
            body: '.tooltip-body',
            inner: '.tooltip-inner',
            arrow: '.tooltip-arr',
            closeBtn: '.tooltip-close'
        },
        resize: function () {
            if (!$(ui.tooltip.className.btn + ui.tooltip.className.active).length) return;
            $(ui.tooltip.className.btn + ui.tooltip.className.active).each(function () {
                const $btn = $(this);
                const $wrap = $btn.closest(ui.tooltip.className.wrap);
                const $cont = $wrap.find(ui.tooltip.className.body);
                const $winW = $(window).width() - 40;
                const $btnW = $btn.outerWidth();
                const $btnX = Math.min($winW + $btnW / 2 - 2, $btn.offset().left) - 20;
                let $scrollEnd = $(window).height() + $(window).scrollTop();

                if ($(ui.className.bottomFixed + ':visible').length) $scrollEnd = $scrollEnd - $(ui.className.bottomFixed).children().outerHeight();

                const $left = Math.max(-4, $btnX);
                $cont.children(ui.tooltip.className.arrow).css({
                    left: $left + $btnW / 2
                });
                $cont.css({
                    width: $winW,
                    left: -$left
                });

                const $contY = $wrap.offset().top + $wrap.outerHeight() + parseInt($cont.css('margin-top')) + parseInt($cont.css('margin-bottom')) + $cont.outerHeight();
                if ($cont.hasClass('is-bottom')) {
                    $cont.addClass('bottom');
                } else {
                    if ($scrollEnd - 10 < $contY) {
                        $cont.addClass('bottom');
                    } else {
                        $cont.removeClass('bottom');
                    }
                }
            });
        },
        position: function (tar) {
            const $tar = $(tar);

            if (!$tar.find(ui.tooltip.className.inner).length) $tar.wrapInner('<div class="' + ui.tooltip.className.inner.slice(1) + '"></div>');
            if (!$tar.find(ui.tooltip.className.arrow).length) $tar.prepend('<i class="' + ui.tooltip.className.arrow.slice(1) + '" aria-hidden="true"></i>');
            if (!$tar.find(ui.tooltip.className.closeBtn).length) $tar.find(ui.tooltip.className.inner).append('<a href="#" class="' + ui.tooltip.className.closeBtn.slice(1) + '" role="button" aria-label="툴팁닫기"></a>');
            ui.tooltip.resize();
        },
        aria: function (element) {
            $(element).each(function (e) {
                const $btn = $(this).find(ui.tooltip.className.btn);
                const $cont = $(this).find(ui.tooltip.className.body);
                let $contId = $cont.attr('id');
                const $closeBtn = $(this).find(ui.tooltip.className.closeBtn);

                if (!$contId) $contId = 'ttCont-' + e;
                $btn.attr({
                    role: 'button'
                    // 'aria-describedby': $contId
                });
                $cont.attr({
                    // id: $contId,
                    role: 'tooltip'
                });
                $closeBtn.attr('role', 'button');
            });
        },
        reInit: function () {
            ui.tooltip.aria(ui.tooltip.className.wrap);
        },
        init: function () {
            ui.tooltip.aria(ui.tooltip.className.wrap);

            //열기
            $(document).on('click', ui.tooltip.className.wrap + ' ' + ui.tooltip.className.btn, function (e) {
                e.preventDefault();

                $cont = $(this).closest(ui.tooltip.className.wrap).find(ui.tooltip.className.body);
                if ($(this).hasClass('is-pop')) {
                    const $popContent = $cont.html();
                    const $popTitle = $cont.attr('title');
                    if ($popTitle !== undefined) {
                        Layer.tooltip($popContent, $popTitle);
                    } else {
                        Layer.tooltip($popContent);
                    }
                } else {
                    if ($(this).hasClass(ui.tooltip.className.active.slice(1))) {
                        $cont.stop(true, false).fadeOut();
                        $(this).removeClass(ui.tooltip.className.active.slice(1));
                    } else {
                        $(ui.tooltip.className.btn).removeClass(ui.tooltip.className.active.slice(1));
                        $(ui.tooltip.className.body).fadeOut();
                        $(this).addClass(ui.tooltip.className.active.slice(1));
                        $cont.stop(true, false).fadeIn();
                        setTimeout(function () {
                            ui.tooltip.position($cont);
                        }, 30);
                    }
                }
            });
            //닫기
            $(document).on('click', ui.tooltip.className.closeBtn, function (e) {
                e.preventDefault();
                const $cont = $(this).closest(ui.tooltip.className.body);
                const $btn = $cont.siblings(ui.tooltip.className.btn);
                $btn.removeClass(ui.tooltip.className.active.slice(1));
                $cont.stop(true, false).fadeOut(500, function () {
                    $btn.focus();
                });
            });
            $(document)
                .on('click touchend', function (e) {
                    $(ui.tooltip.className.body).stop(true, false).fadeOut();
                    $(ui.tooltip.className.wrap + ' ' + ui.tooltip.className.btn).removeClass(ui.tooltip.className.active.slice(1));
                })
                .on('click touchend', ui.tooltip.className.wrap, function (e) {
                    e.stopPropagation();
                });
        }
    },
    forms: () => {
        const inpBox = $('.input-box');
        const inp = $('.input-box input');

        inpBox.each(function () {
            inp.on('input', function () {
                if ($(this).val() != '') {
                    $(this).closest(inpBox).addClass('focus');
                } else {
                    $(this).closest(inpBox).removeClass('focus');
                }
            });
        });

        const inpError = inpBox.hasClass('error');

        if (inpError) {
            $(this).find('input').addClass('error');
        } else {
        }

        $(document).on('click', '.btn-inp-del', function () {
            const $inp = $(this).siblings('input');
            $inp.val('').change().focus();
            $(this).parents('.input-box').removeClass('focus');
        });

        $(document).on('click', '.btn-inp-pw', function (e) {
            e.preventDefault();

            $(this).toggleClass('is-show');

            const $inp = $(this).siblings('input');

            if ($(this).hasClass('is-show')) {
                $inp.prop('type', 'text');
            } else {
                $inp.prop('type', 'password');
            }
        });
    },
    select: {
        className: {
            wrap: '.select-box',
            btn: '.btn-select',
            btnActive: '.open',
            optionsWrap: '.select-options',
            option: '.select-option',
            selectPopClass: '.select-pop',
            selectPopWrap: '.pop-select'
        },
        init: function () {
            ui.select.ready();
            ui.select.UI();
        },
        ready: function () {
            $(ui.select.className.wrap).each(function () {
                const $this = $(this);
                const $sel = $this.find('select');
                if (!$this.find(ui.select.className.btn).length) {
                    const $title = $sel.attr('title') || '선택';
                    const $btn = `<button class="${ui.select.className.btn.slice(1)}" title="${$title}"></button>`;
                    $sel.hide();
                    $this.append($btn);
                    ui.select.setBtnText($sel);
                }
            });
        },
        setBtnText(elem) {
            const $el = $(elem);
            const $btn = $el.siblings(ui.select.className.btn);
            if (!$el.length || !$btn.length) return;
            const $selectedTxt = $el.find(':selected').text();
            $btn.text($selectedTxt);
        },
        makeOptions: function (select, btn) {
            const $select = $(select);
            const $btn = $(btn);
            if (!$select.children().length) return;
            const isPop = $select.hasClass(ui.select.className.selectPopClass.slice(1));

            let $options = $(ui.select.className.optionsWrap);
            if ($options.length) ui.select.reset();

            const $title = $btn.attr('title');
            let $optionHtml = '';
            if (isPop) $optionHtml += '<div class="' + ui.select.className.selectPopWrap.slice(1) + '">';
            $optionHtml += '<div class="' + ui.select.className.optionsWrap.slice(1) + '">';
            $optionHtml += '<h1>' + $title + '</h1>';
            $optionHtml += '<ul>';
            $select.children().each(function () {
                const $this = $(this);
                const $val = $this.attr('value');
                const $text = $this.text();
                const $seletedClass = $this.prop('selected') ? ' selected' : '';
                $optionHtml += '<li><button class="' + ui.select.className.option.slice(1) + $seletedClass + '" data-val="' + $val + '">' + $text + '</button></li>';
            });
            $optionHtml += '</ul>';
            $optionHtml += '</div>';
            if (isPop) $optionHtml += '</div>';

            $('body').append($optionHtml);
            $options = $(ui.select.className.optionsWrap);
            $options.data('select', select);

            if (isPop) {
                $options.animate({ bottom: 0 }, 500);
            }

            if (!isPop) {
                let $top = $btn.offset().top + $btn.outerHeight();
                let $left = $btn.offset().left;
                const $width = $btn.outerWidth();
                if ($top + $options.outerHeight() > $(window).scrollTop() + $(window).height() + 20) {
                    $top = $top - $btn.outerHeight() - $options.outerHeight() - 2;
                }
                if ($left + $options.outerWidth() > $(window).scrollLeft() + $(window).width()) {
                    $left = $left + $btn.outerWidth() - $options.outerWidth();
                }
                $options.css({
                    top: $top + 2,
                    left: $left,
                    minWidth: $width
                });
            }
        },
        reset: function () {
            const $options = $(ui.select.className.optionsWrap);
            if (!$options.length) return;
            $options.each(function () {
                const $this = $(this);
                const $select = $($this.data('select'));
                if (!$select) return;
                const $btn = $select.siblings(ui.select.className.btn);
                if ($btn.length) $btn.removeClass(ui.select.className.btnActive.slice(1));
                const $wrap = $this.closest(ui.select.className.selectPopWrap).length ? $this.closest(ui.select.className.selectPopWrap) : $this;

                if ($this.parent('.pop-select').length) {
                    $wrap.find('.select-options').animate({ bottom: -100 + '%' }, 500, function () {
                        $wrap.remove();
                    });
                } else {
                    $wrap.remove();
                }
            });

            const $btn = $(ui.select.className.btn + ui.select.className.btnActive);
            if ($btn.length) $btn.removeClass(ui.select.className.btnActive.slice(1));
        },
        UI: function () {
            //select change
            $(document).on('change', ui.select.className.wrap + ' select', function (e) {
                ui.select.setBtnText(this);
            });

            //btn
            $(document).on('click', ui.select.className.btn, function (e) {
                e.preventDefault();
                const $this = $(this);
                const $select = $this.siblings('select');

                $('body').addClass('lock-body');

                if ($this.hasClass(ui.select.className.btnActive.slice(1))) {
                    ui.select.reset();
                } else {
                    $this.addClass(ui.select.className.btnActive.slice(1));
                    ui.select.makeOptions($select, $this);
                }
            });

            //option
            $(document).on('click', ui.select.className.option, function (e) {
                e.preventDefault();
                const $this = $(this);
                const $val = $this.data('val');
                const $closest = $this.closest(ui.select.className.optionsWrap);
                const $select = $closest.data('select');
                const $btn = $select.siblings(ui.select.className.btn);
                $select.val($val).change();
                ui.select.reset();
                $btn.removeClass(ui.select.className.btnActive.slice(1)).focus();

                $('body').removeClass('lock-body');
            });

            //out click
            $(document)
                .on('click touchend', function (e) {
                    ui.select.reset();
                    $('body').removeClass('lock-body');
                })
                .on('click touchend', ui.select.className.wrap + ',' + ui.select.className.optionsWrap, function (e) {
                    e.stopPropagation();
                });
        }
    },
    popup: {
        zIndex: 1001,
        popCnt: 0,
        toast: function (target) {
            var $toastPop = $(target),
                delayTime = 3000;

            $toastPop.close = null;

            clearTimeout($toastPop.close);

            $toastPop.fadeIn(100, function () {
                setTimeout(function () {
                    $toastPop.addClass('is-end');
                }, delayTime);
            });

            $toastPop.on('transitionend', function () {
                $toastPop.addClass('is-end').hide().removeClass('is-end');
            });

            $('.btn-close', $toastPop)
                .off('click')
                .on('click', function () {
                    clearTimeout($toastPop.close);
                    $toastPop.addClass('is-end');
                });
        },
        open: function (target, popOpen, param) {
            console.log('팝업열기 : ' + target.selector);

            let $layer = $(target);

            $(document).ready(function () {
                $('body').addClass('lock-body');
            });

            $layer.each(function () {
                let $btnClose = $layer.find('.btn-pop-close');
                let $btnConfirm = $layer.find('.btn-pop-confirm');
                // const callback = $layer.data('callback');

                $layer.addClass('is-active');
                if (!$layer.hasClass('full')) {
                    setTimeout(function () {
                        $layer.addClass('is-animation');
                    }, 100);
                } else {
                    let btnBoxHeight = $layer.find('.layer-content').siblings('.btn-bottom-box').outerHeight(true);
                    if ($('.layer-content + .btn-bottom-box').length) {
                        $layer.find('.layer-content').css('padding-bottom', btnBoxHeight);
                    }
                }

                $btnClose.on('click', function (e) {
                    e.preventDefault();

                    $('.wrap').removeClass('lock-wrap');

                    if ($layer.hasClass('full')) {
                        $layer.removeClass('is-active');
                        $layer.find('.layer-content').removeAttr('style');
                    } else {
                        $layer.removeClass('is-animation');
                        let eventEnd = () => {
                            $layer.removeClass('is-active');
                            $layer.off('transitionend', eventEnd);
                        };
                        $layer.on('transitionend', eventEnd);
                    }
                });

                $btnConfirm.on('click', function (e) {
                    e.preventDefault();

                    $('.wrap').removeClass('lock-wrap');

                    if ($layer.hasClass('full')) {
                        $layer.removeClass('is-active');
                        $layer.find('.layer-content').removeAttr('style');
                    } else {
                        $layer.removeClass('is-animation');
                        let eventEnd = () => {
                            $layer.removeClass('is-active');
                            $layer.off('transitionend', eventEnd);
                        };
                        $layer.on('transitionend', eventEnd);
                    }

                    //콜백함수 경우
                    let callback = $layer.data('callback');

                    if (callback) {
                        ui.popup.close(target, popOpen);

                        let callbackFunction = window[callback];

                        if (typeof callbackFunction === 'function') {
                            callbackFunction(target, popOpen, param);
                        }
                    }
                });
            });
        },
        close: function (target, popOpen, param, callback) {
            console.log('팝업닫기 : ' + target.selector);
        },
        callbackPopup: function (message, callback) {
            var popupHtml = `
            <article class="layerpopup-box msg" role="dialog">
                <div class="layer-popup msg-box">
                    <p class="msg">${message}</p>
                    <div class="btn-box">
                        <button type="button" class="btn btn-primary btn-pop-confirm" title="확인">확인</button>
                    </div>
                </div>
            </article>
        `;

            // 팝업 열기 함수 호출
            this.open($(popupHtml), null, null);

            // 확인 버튼 클릭 시 콜백 함수 실행
            $('.btn-pop-confirm').on('click', function () {
                ui.popup.close($(this).closest('.layerpopup-box'), null, null, callback);
            });
        }
    },
    etc: () => {
        // function scrollBottom() {
        //     const $scrollBottom = $(document).outerHeight(true);

        //     $('html, body').stop(true).animate({ scrollTop: $scrollBottom }, 1000);
        // }

        // let $btnLoadmore = $('.btn-loadmore');
        // let $siblings = $btnLoadmore.parent().siblings();

        // $siblings.find('li').slice(0, 5).show();

        // $(document).ready(function () {
        //     $btnLoadmore.on('click', function (e) {
        //         e.preventDefault();

        //         const $item = $('.tag-list-box li:hidden');

        //         scrollBottom();

        //         $item.slice(0, 5).show();

        //         if ($item.length - 5 == 0) {
        //             $(this).parent().hide();
        //         }
        //     });
        // });

        const $btnMore = $('.btn-loadmore');
        const $batchNum = 5;
        const $listWrap = $btnMore.closest('.tag-list-box').find('ul');
        const $li = $listWrap.find('li');
        $li.hide();
        $li.slice(0, $batchNum).show();

        if ($li.length <= 5) {
            $btnMore.parent().hide();
        }

        function showNextBatch() {
            const start = Math.ceil($li.filter(':visible').length / $batchNum) * $batchNum;
            const end = start + $batchNum;

            if ($li.slice(start, end).filter(':hidden').length === 0) {
                $btnMore.parent().hide();
                return;
            } else if ($li.slice(start, end).filter(':hidden').length < 5) {
                $li.slice(start, end).show().parent().siblings().hide();
            }

            $li.slice(start, end).show();

            if ($li.filter(':visible').length >= 20) {
                $btnMore.parent().hide();
            }
        }

        function expandScroll() {
            const $fScl = $(document).outerHeight();
            $('html, body').stop().animate({ scrollTop: $fScl }, 1500);
        }

        $btnMore.on('click', function (e) {
            e.preventDefault();
            showNextBatch();
            expandScroll();
        });
        // 더보기

        $('input[name=chk_all]').on('change', function () {
            if ($('input[name=chk_all]').is(':checked')) $('input[name=chk]').prop('checked', true);
            else $('input[name=chk]').prop('checked', false);
        });

        $('input[name=chk]').on('change', function () {
            var total = $('input[name=chk]').length;
            var checked = $('input[name=chk]:checked').length;

            if (total != checked) $('input[name=chk_all]').prop('checked', false);
            else $('input[name=chk_all]').prop('checked', true);
        });
        // 전체 체크 및 개별 체크
    }
};

$(document).ready(() => {
    ui.init();
});
