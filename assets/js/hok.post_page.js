document.addEventListener('DOMContentLoaded', () => {
    initComments()
    initPostPage()
});

/**
 * 初始化文章页面
 */
function initPostPage() {
    initPost()
    initPostMenu()
}

/**
 * 初始化评论所有功能
 */
function initComments() {
    changeCommentPattern()
    activeCommentDraw()
    rewriteComments()
    activeCommentSubmit()
    setCommentReplyTarget()
    formatCommentsPageHash()
    initOwo()
}

/**
 * 评论框点击切换画图模式和文本模式
 */
function changeCommentPattern() {
    if ($(".hok_comment").length) {
        $(".hok_comment__respond-type .item").on("click", function () {
            $(this).addClass("active").siblings().removeClass("active");
            if ($(this).attr("data-type") === "draw") {
                $(".hok_comment__respond-form .body .draw").show().siblings().hide();
                $("#hok_comment_draw").prop("width", $(".hok_comment__respond-form .body").width());
                /* 设置表单格式为画图模式 */
                $(".hok_comment__respond-form").attr("data-type", "draw");
            } else {
                $(".hok_comment__respond-form .body .text").show().siblings().hide();
                /* 设置表单格式为文字模式 */
                $(".hok_comment__respond-form").attr("data-type", "text");
            }
        });
    }
}

/**
 * 激活画图功能
 */
function activeCommentDraw() {
    if ($("#hok_comment_draw").length) {
        /* 激活画板 */
        window.sketchpad = new Sketchpad({ element: "#hok_comment_draw", height: 300, penSize: 5, color: "303133" });
        /* 撤销上一步 */
        $(".hok_comment__respond-form .body .draw .icon-undo").on("click", () => window.sketchpad.undo());
        /* 动画预览 */
        $(".hok_comment__respond-form .body .draw .icon-animate").on("click", () => window.sketchpad.animate(10));
        /* 更改画板的线宽 */
        $(".hok_comment__respond-form .body .draw .line li").on("click", function () {
            window.sketchpad.penSize = $(this).attr("data-line");
            $(this).addClass("active").siblings().removeClass("active");
        });
        /* 更改画板的颜色 */
        $(".hok_comment__respond-form .body .draw .color li").on("click", function () {
            window.sketchpad.color = $(this).attr("data-color");
            $(this).addClass("active").siblings().removeClass("active");
        });
    }
}

/**
 * 重写评论功能
 */
function rewriteComments() {
    if ($(".hok_comment__respond").length) {
        const respond = $(".hok_comment__respond");
        /* 重写回复功能 */
        $(".hok_comment__reply").on("click", function () {
            /* 父级ID */
            const coid = $(this).attr("data-coid");
            /* 当前的项 */
            const item = $("#" + $(this).attr("data-id"));
            /* 添加自定义属性表示父级ID */
            respond.find(".hok_comment__respond-form").attr("data-coid", coid);
            item.append(respond);
            $(".hok_comment__respond-type .item[data-type='text']").click();
            $(".hok_comment__cancle").show();
            window.scrollTo({
                top: item.offset().top - $(".hok_header").height() - 15,
                behavior: "smooth",
            });
        });
        /* 重写取消回复功能 */
        $(".hok_comment__cancle").on("click", function () {
            /* 移除自定义属性父级ID */
            respond.find(".hok_comment__respond-form").removeAttr("data-coid");
            $(".hok_comment__cancle").hide();
            $(".hok_comment__title").after(respond);
            $(".hok_comment__respond-type .item[data-type='text']").click();
            window.scrollTo({
                top: $(".hok_comment").offset().top - $(".hok_header").height() - 15,
                behavior: "smooth",
            });
        });
    }
}

/**
 * 激活评论提交
 */
function activeCommentSubmit() {
    if ($(".hok_comment").length) {
        let isSubmit = false;
        $(".hok_comment__respond-form").on("submit", function (e) {
            e.preventDefault();
            const action = $(".hok_comment__respond-form").attr("action") + "?time=" + +new Date();
            const type = $(".hok_comment__respond-form").attr("data-type");
            const parent = $(".hok_comment__respond-form").attr("data-coid");
            const author = $(".hok_comment__respond-form .head input[name='author']").val();
            const _ = $(".hok_comment__respond-form input[name='_']").val();
            const mail = $(".hok_comment__respond-form .head input[name='mail']").val();
            const url = $(".hok_comment__respond-form .head input[name='url']").val();
            let text = $(".hok_comment__respond-form .body textarea[name='text']").val();
            if (author.trim() === "") return Qmsg.info("请输入昵称！");
            if (!/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(mail)) return Qmsg.info("请输入正确的邮箱！");
            if (type === "text" && text.trim() === "") return Qmsg.info("请输入评论内容！");
            if (type === "draw") {
                const txt = $("#hok_comment_draw")[0].toDataURL("image/webp", 0.1);
                text = "{!{" + txt + "}!} ";
            }
            if (isSubmit) return;
            isSubmit = true;
            $(".hok_comment__respond-form .foot .submit button").html("发送中...");
            $.ajax({
                url: action,
                type: "POST",
                data: { author, mail, text, parent, url, _ },
                dataType: "text",
                success(res) {
                    let arr = [],
                        str = "";
                    arr = $(res).contents();
                    Array.from(arr).forEach((_) => {
                        if (_.parentNode.className === "container") str = _;
                    });
                    if (!/Hok/.test(res)) {
                        Qmsg.warning(str.textContent.trim() || "");
                        isSubmit = false;
                        $(".hok_comment__respond-form .foot .submit button").html("发表评论");
                    } else {
                        let parser = new DOMParser(), dom = parser.parseFromString(res, "text/html");//字符串转DOM
                        let newIdNumber = res.match(/id=\"?comment-\d+/g).join().match(/\d+/g).sort(
                            (a, b) => {
                                return a - b
                            }).pop();
                        let newId = 'comment-' + newIdNumber;
                        let list = document.getElementById('hok_comment');
                        let newList = dom.getElementById('hok_comment');
                        list.innerHTML = newList.innerHTML;
                        Qmsg.success("评论成功！")
                        document.getElementById(newId).scrollIntoView({ behavior: "smooth" });//滚动到对应锚点
                        initComments()
                    }
                },
                error() {
                    isSubmit = false;
                    $(".hok_comment__respond-form .foot .submit button").html("发表评论");
                    Qmsg.warning("发送失败！请刷新重试！");
                },
            });
        });
    }
}

/**
 * 设置评论回复网址为新窗口打开
 */
function setCommentReplyTarget() {
    $(".comment-list__item .term .content .user .author a").each((index, item) => $(item).attr("target", "_blank"));
}

/**
 * 格式化评论分页的hash值
 */
function formatCommentsPageHash() {
    $(".hok_comment .hok_pagination a").each((index, item) => {
        const href = $(item).attr("href");
        if (href && href.includes("#")) {
            $(item).attr("href", href.replace("#comments", "?scroll=hok_comment"));
        }
    });
}

/**
 * 初始化表情功能
 */
function initOwo() {
    if ($(".hok_owo__contain").length && $(".hok_owo__target").length) {
        $.ajax({
            url: window.Hok.THEME_URL + "assets/json/hok.owo.json",
            dataType: "json",
            success(res) {
                let barStr = "";
                let scrollStr = "";
                for (let key in res) {
                    const item = res[key];
                    barStr += `<div class="item" data-type="${key}">${key}</div>`;
                    scrollStr += `
                            <ul class="scroll" data-type="${key}">
								${item.map((_) => `<li class="item" data-text="${_.data}">${key === "颜文字" ? `${_.icon}` : `<img class="lazyload" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjUyOTQ1MjE4NjI3IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjMzNTEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTU2My4yIDQ2My4zTDY3NyA1NDBjMS43IDEuMiAzLjcgMS44IDUuOCAxLjggMC43IDAgMS40LTAuMSAyLTAuMiAyLjctMC41IDUuMS0yLjEgNi42LTQuNGwyNS4zLTM3LjhjMS41LTIuMyAyLjEtNS4xIDEuNi03LjhzLTIuMS01LjEtNC40LTYuNmwtNzMuNi00OS4xIDczLjYtNDkuMWMyLjMtMS41IDMuOS0zLjkgNC40LTYuNiAwLjUtMi43IDAtNS41LTEuNi03LjhsLTI1LjMtMzcuOGExMC4xIDEwLjEgMCAwIDAtNi42LTQuNGMtMC43LTAuMS0xLjMtMC4yLTItMC4yLTIuMSAwLTQuMSAwLjYtNS44IDEuOGwtMTEzLjggNzYuNmMtOS4yIDYuMi0xNC43IDE2LjQtMTQuNyAyNy41IDAuMSAxMSA1LjUgMjEuMyAxNC43IDI3LjR6TTM4NyAzNDguOGgtNDUuNWMtNS43IDAtMTAuNCA0LjctMTAuNCAxMC40djE1My4zYzAgNS43IDQuNyAxMC40IDEwLjQgMTAuNEgzODdjNS43IDAgMTAuNC00LjcgMTAuNC0xMC40VjM1OS4yYzAtNS43LTQuNy0xMC40LTEwLjQtMTAuNHogbTMzMy44IDI0MS4zbC00MS0yMGExMC4zIDEwLjMgMCAwIDAtOC4xLTAuNWMtMi42IDAuOS00LjggMi45LTUuOSA1LjQtMzAuMSA2NC45LTkzLjEgMTA5LjEtMTY0LjQgMTE1LjItNS43IDAuNS05LjkgNS41LTkuNSAxMS4ybDMuOSA0NS41YzAuNSA1LjMgNSA5LjUgMTAuMyA5LjVoMC45Yzk0LjgtOCAxNzguNS02Ni41IDIxOC42LTE1Mi43IDIuNC01IDAuMy0xMS4yLTQuOC0xMy42eiBtMTg2LTE4Ni4xYy0xMS45LTQyLTMwLjUtODEuNC01NS4yLTExNy4xLTI0LjEtMzQuOS01My41LTY1LjYtODcuNS05MS4yLTMzLjktMjUuNi03MS41LTQ1LjUtMTExLjYtNTkuMi00MS4yLTE0LTg0LjEtMjEuMS0xMjcuOC0yMS4xaC0xLjJjLTc1LjQgMC0xNDguOCAyMS40LTIxMi41IDYxLjctNjMuNyA0MC4zLTExNC4zIDk3LjYtMTQ2LjUgMTY1LjgtMzIuMiA2OC4xLTQ0LjMgMTQzLjYtMzUuMSAyMTguNCA5LjMgNzQuOCAzOS40IDE0NSA4Ny4zIDIwMy4zIDAuMSAwLjIgMC4zIDAuMyAwLjQgMC41bDM2LjIgMzguNGMxLjEgMS4yIDIuNSAyLjEgMy45IDIuNiA3My4zIDY2LjcgMTY4LjIgMTAzLjUgMjY3LjUgMTAzLjUgNzMuMyAwIDE0NS4yLTIwLjMgMjA3LjctNTguNyAzNy4zLTIyLjkgNzAuMy01MS41IDk4LjEtODUgMjcuMS0zMi43IDQ4LjctNjkuNSA2NC4yLTEwOS4xIDE1LjUtMzkuNyAyNC40LTgxLjMgMjYuNi0xMjMuOCAyLjQtNDMuNi0yLjUtODctMTQuNS0xMjl6IG0tNjAuNSAxODEuMWMtOC4zIDM3LTIyLjggNzItNDMgMTA0LTE5LjcgMzEuMS00NC4zIDU4LjYtNzMuMSA4MS43LTI4LjggMjMuMS02MSA0MS05NS43IDUzLjQtMzUuNiAxMi43LTcyLjkgMTkuMS0xMTAuOSAxOS4xLTgyLjYgMC0xNjEuNy0zMC42LTIyMi44LTg2LjJsLTM0LjEtMzUuOGMtMjMuOS0yOS4zLTQyLjQtNjIuMi01NS4xLTk3LjctMTIuNC0zNC43LTE4LjgtNzEtMTkuMi0xMDcuOS0wLjQtMzYuOSA1LjQtNzMuMyAxNy4xLTEwOC4yIDEyLTM1LjggMzAtNjkuMiA1My40LTk5LjEgMzEuNy00MC40IDcxLjEtNzIgMTE3LjItOTQuMSA0NC41LTIxLjMgOTQtMzIuNiAxNDMuNC0zMi42IDQ5LjMgMCA5NyAxMC44IDE0MS44IDMyIDM0LjMgMTYuMyA2NS4zIDM4LjEgOTIgNjQuOCAyNi4xIDI2IDQ3LjUgNTYgNjMuNiA4OS4yIDE2LjIgMzMuMiAyNi42IDY4LjUgMzEgMTA1LjEgNC42IDM3LjUgMi43IDc1LjMtNS42IDExMi4zeiIgcC1pZD0iMzM1MiIgZmlsbD0iI2JmYmZiZiI+PC9wYXRoPjwvc3ZnPg==" data-src="${window.Hok.THEME_URL + _.icon}" alt="${_.data}"/>`}</li>`).join("")}
                            </ul>
                        `;
                }
                $(".hok_owo__contain").html(`
                        <div class="seat"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" style="height: 23px;line-height: 23px;opacity: .8;border-radius: 50px;width: 23px;fill: var(--routine);"><path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm141.4 389.4c-37.8 37.8-88 58.6-141.4 58.6s-103.6-20.8-141.4-58.6S48 309.4 48 256s20.8-103.6 58.6-141.4S194.6 56 248 56s103.6 20.8 141.4 58.6S448 202.6 448 256s-20.8 103.6-58.6 141.4zM328 224c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm-160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm194.4 64H133.6c-8.2 0-14.5 7-13.5 15 7.5 59.2 58.9 105 121.1 105h13.6c62.2 0 113.6-45.8 121.1-105 1-8-5.3-15-13.5-15z"></path></svg></div>
                        <div class="box">
                            ${scrollStr}
                            <div class="bar">${barStr}</div>
                        </div>
                    `);
                $(document).on("click", function () {
                    $(".hok_owo__contain .box").stop().slideUp("fast");
                });
                $(".hok_owo__contain .seat").on("click", function (e) {
                    e.stopPropagation();
                    $(this).siblings(".box").stop().slideToggle("fast");
                });
                $(".hok_owo__contain .box .bar .item").on("click", function (e) {
                    e.stopPropagation();
                    $(this).addClass("active").siblings().removeClass("active");
                    const scrollIndx = '.hok_owo__contain .box .scroll[data-type="' + $(this).attr("data-type") + '"]';
                    $(scrollIndx).show().siblings(".scroll").hide();
                });
                $(".hok_owo__contain .scroll .item").on("click", function () {
                    const text = $(this).attr("data-text");
                    $(".hok_owo__target").insertContent(text);
                });
                $(".hok_owo__contain .box .bar .item").first().click();
            },
        });
    }
}


/**
 * 初始化文章页面
 */
function initPost() {
    const encryption = str => window.btoa(unescape(encodeURIComponent(str)));
    const decrypt = str => decodeURIComponent(escape(window.atob(str)));

    /* 当前页的CID */
    const cid = $('.hok_detail').attr('data-cid');

    /* 获取本篇文章百度收录情况 */
    {
        $.ajax({
            url: Hok.BASE_API,
            type: 'POST',
            dataType: 'json',
            data: { routeType: 'baidu_record', site: window.location.href },
            success(res) {
                if (res.data && res.data === '已收录') {
                    // $('#Hok_Baidu_Record').css('color', '#67C23A');
                    // $('#Hok_Baidu_Record').html('已收录');
                } else {
                    /* 如果填写了Token，则自动推送给百度 */
                    if (Hok.BAIDU_PUSH) {
                        // $('#Hok_Baidu_Record').html('<span style="color: #E6A23C">未收录，推送中...</span>');
                        const _timer = setTimeout(function () {
                            $.ajax({
                                url: Hok.BASE_API,
                                type: 'POST',
                                dataType: 'json',
                                data: {
                                    routeType: 'baidu_push',
                                    domain: window.location.protocol + '//' + window.location.hostname,
                                    url: encodeURI(window.location.href)
                                },
                                success(res) {
                                    if (res.data.error) {
                                        // $('#Hok_Baidu_Record').html('<span style="color: #F56C6C">推送失败，请检查！</span>');
                                    } else {
                                        // $('#Hok_Baidu_Record').html('<span style="color: #67C23A">推送成功！</span>');
                                    }
                                }
                            });
                            clearTimeout(_timer);
                        }, 1000);
                    } else {
                        const url = `https://ziyuan.baidu.com/linksubmit/url?sitename=${encodeURI(window.location.href)}`;
                        // $('#Hok_Baidu_Record').html(`<a target="_blank" href="${url}" rel="noopener noreferrer nofollow" style="color: #F56C6C">未收录，提交收录</a>`);
                    }
                }
            }
        });
    }

    /* 激活代码高亮 */
    {
        Prism.highlightAll();
        $("pre[class*='language-']").each(function (index, item) {
            let text = $(item).find("code[class*='language-']").text();
            let span = $(`<span class="copy"><i class="fa fa-clone"></i></span>`);
            new ClipboardJS(span[0], { text: () => text }).on('success', () => Qmsg.success('复制成功！'));
            $(item).append(span);
        });
    }

    /* 设置文章内的链接为新窗口打开 */
    {
        $('.hok_detail__article a:not(.hok_detail__article-anote)').each(function () {
            $(this).attr({ target: '_blank', rel: 'noopener noreferrer nofollow' });
        });
    }

    /* 激活浏览功能 */
    {
        let viewsArr = localStorage.getItem(encryption('views')) ? JSON.parse(decrypt(localStorage.getItem(encryption('views')))) : [];
        const flag = viewsArr.includes(cid);
        if (!flag) {
            $.ajax({
                url: Hok.BASE_API,
                type: 'POST',
                dataType: 'json',
                data: { routeType: 'handle_views', cid },
                success(res) {
                    if (res.code !== 1) return;
                    $('#Hok_Article_Views').html(`${res.data.views} 阅读`);
                    viewsArr.push(cid);
                    const name = encryption('views');
                    const val = encryption(JSON.stringify(viewsArr));
                    localStorage.setItem(name, val);
                }
            });
        }
    }

    /* 激活文章点赞功能 */
    {
        let agreeArr = localStorage.getItem(encryption('agree')) ? JSON.parse(decrypt(localStorage.getItem(encryption('agree')))) : [];
        if (agreeArr.includes(cid)) $('.hok_detail__agree .icon-1').addClass('active');
        else $('.hok_detail__agree .icon-2').addClass('active');
        let _loading = false;
        $('.hok_detail__agree .icon').on('click', function () {
            if (_loading) return;
            _loading = true;
            agreeArr = localStorage.getItem(encryption('agree')) ? JSON.parse(decrypt(localStorage.getItem(encryption('agree')))) : [];
            let flag = agreeArr.includes(cid);
            $.ajax({
                url: Hok.BASE_API,
                type: 'POST',
                dataType: 'json',
                data: { routeType: 'handle_agree', cid, type: flag ? 'disagree' : 'agree' },
                success(res) {
                    if (res.code !== 1) return;
                    $('.hok_detail__agree .text').html(res.data.agree);
                    if (flag) {
                        const index = agreeArr.findIndex(_ => _ === cid);
                        agreeArr.splice(index, 1);
                        $('.hok_detail__agree .icon-1').removeClass('active');
                        $('.hok_detail__agree .icon-2').addClass('active');
                        $('.hok_detail__agree .icon').removeClass('active');
                        Qmsg.warning("已取消点赞！");
                    } else {
                        agreeArr.push(cid);
                        $('.hok_detail__agree .icon-2').removeClass('active');
                        $('.hok_detail__agree .icon-1').addClass('active');
                        $('.hok_detail__agree .icon').addClass('active');
                        Qmsg.success("点赞成功");
                    }
                    const name = encryption('agree');
                    const val = encryption(JSON.stringify(agreeArr));
                    localStorage.setItem(name, val);
                },
                complete() {
                    _loading = false;
                }
            });
        });
    }

    /* 密码保护文章，输入密码访问 */
    {
        let isSubmit = false;
        $('.hok_detail__article-protected').on('submit', function (e) {
            e.preventDefault();
            const url = $(this).attr('action') + '&time=' + +new Date();
            const protectPassword = $(this).find('input[type="password"]').val();
            if (protectPassword.trim() === '') return Qmsg.info('请输入访问密码！');
            if (isSubmit) return;
            isSubmit = true;
            $.ajax({
                url,
                type: 'POST',
                data: {
                    cid,
                    protectCID: cid,
                    protectPassword
                },
                dataType: 'text',
                success(res) {
                    let arr = [],
                        str = '';
                    arr = $(res).contents();
                    Array.from(arr).forEach(_ => {
                        if (_.parentNode.className === 'container') str = _;
                    });
                    if (!/Hok/.test(res)) {
                        Qmsg.warning(str.textContent.trim() || '');
                        isSubmit = false;
                        $('.hok_comment__respond-form .foot .submit button').html('发表评论');
                    } else {
                        location.reload();
                    }
                }
            });
        });
    }

    /* 激活文章视频模块 */
    {
        if ($('.hok_detail__article-video').length > 0) {
            const player = $('.hok_detail__article-video .play iframe').attr('data-player');
            $('.hok_detail__article-video .episodes .item').on('click', function () {
                $(this).addClass('active').siblings().removeClass('active');
                const url = $(this).attr('data-src');
                $('.hok_detail__article-video .play iframe').attr({ src: player + url });
            });
            $('.hok_detail__article-video .episodes .item').first().click();
        }
    }

    /* 分享 */
    {
        if ($('.hok_detail__operate-share').length) {
            $('.hok_detail__operate-share > svg').on('click', e => {
                e.stopPropagation();
                $('.hok_detail__operate-share').toggleClass('active');
            });
            $(document).on('click', () => $('.hok_detail__operate-share').removeClass('active'));
        }
    }
}

/**
 * 初始化目录
 */
function initPostMenu() {
    if (0 === $(".hok_detail__article").find("h2,h3,h4,h5,h6").length) {
        $(".postmenu").remove();
    } else {
        $(".postmenu").show();
        const headingLevels = ["h2", "h3", "h4", "h5", "h6"];
        const tocContainer = $("#post_menu");

        $(".hok_detail__article").find("h2,h3,h4,h5,h6").each(function (index, element) {
            const heading = $(element);
            const headingLevel = parseInt(heading[0].tagName.charAt(1), 10) - 2;

            const listItem = $("<li></li>").append('<span class="post_menu_item post_menu_tag_' + headingLevels[headingLevel] + '" goto="#menu' + index + '">' + heading.text() + '</span>');
            if (headingLevel === 0) {
                tocContainer.append(listItem);
            } else {
                const parentList = tocContainer.find("li").last().children("ol, ul");
                if (parentList.length === 0) {
                    tocContainer.find("li").last().append('<ol></ol>');
                }
                tocContainer.find("li").last().children("ol, ul").append(listItem);
            }

            $('<span id="menu' + index + '"></span>').insertBefore(heading);
        });

        // 设置样式
        $("#post_menu span").each(function () {
            const currentHeading = $(this);
            const headingLevel = parseInt(currentHeading.attr("class").slice(-1), 10);
            const paddingValue = (headingLevel - 2) * 1 + 0.5 + "rem";
            currentHeading.css("padding-left", paddingValue);
        });
        // 监听滚动事件
        $(window).on("scroll", function () {
            highlightCurrentHeading();
        });
    }
}

$(document).on("click", "#post_menu .post_menu_item", function () {
    $(".menu_position").after($("#post_menu"));
    const targetId = $(this).attr("goto");
    if ($(".hok_header").height() === 0) {
        window.scrollTo({ top: $(targetId).offset().top, behavior: "smooth" });
    } else {
        window.scrollTo({
            top: $(targetId).offset().top - ($(".hok_header").offset().top - $(window).scrollTop() + $(".hok_header").outerHeight()),
            behavior: "smooth"
        });
    }
});

/**
 * 高亮目录
 */
function highlightCurrentHeading() {
    const headerBottom = $(".hok_header").offset().top + $(".hok_header").outerHeight();
    let isAnyHeadingHighlighted = false; // 标记是否有任何标题高亮

    $(".hok_detail__article").find("h2,h3,h4,h5,h6").each(function (index, element) {
        const heading = $(element);
        const headingTop = heading.offset().top;

        if (headingTop <= headerBottom + 5) {
            // 标题顶部到达或超过 header 底部
            $(".post_menu_item").removeClass("active"); // 移除所有标题的高亮状态
            $(".post_menu_item:eq(" + index + ")").addClass("active"); // 高亮当前标题
            isAnyHeadingHighlighted = true; // 有标题被高亮
        }
    });

    if (!isAnyHeadingHighlighted) {
        // 如果没有任何标题被高亮，移除所有标题的高亮状态
        $(".post_menu_item").removeClass("active");
    }
}