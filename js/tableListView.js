;(function($) {
    $.fn.tableListView = function(options) {
        var defaults = {
            firstRequestURL: '',
            requestDataOnlyOnce : true,
            title: [],
            data: [],
            dataHasTitle: true,
            style: "table table-striped",
            pagination : 0,
            loadMode : 'onMouseMoveAddMore'
        };
        var settings = $.extend({}, defaults, options);
        var dataBorder = {start : 1, end : 1};

        var that = $(this);
        $(this).html("<tbody></tbody>");
        $(this).addClass(settings.style);
        /**
         * 初始动态图
         */
        $(this).after('<div class="row"><div class="col-md-2 col-md-offset-5 text-center">' +
            '<img src="./image/loading.gif" />' +
            '</div></div>')

        /**
         * 执行第一次请求
         */
        if (settings.firstRequestURL.length === 0) {
            console.log("第一次请求时URL无效");
            if (settings.data.length === 0) {
                console.log("在没有请求URL的情况下数据区域不可为空");
            }
            setTitle();
            setData();
        } else {
            $.get(settings.firstRequestURL, function (response) {
                if (response.status == true) {
                    that.next().remove();
                    settings.data = response.data;
                    dataBorder.start = settings.dataHasTitle ? 1 : 0;
                    dataBorder.end = response.data.length;

                    if(settings.loadMode == 'onMouseMoveAddMore') {
                        dataBorder.end = Math.min(30, dataBorder.end);
                    }
                    setTitle();
                    setData();
                }
            })
        }

        if(settings.pagination !== 0) {
            addPagination();
        }
        if(settings.loadMode == 'onMouseMoveAddMore') { //当鼠标滚动到底部时，加载更多数据，无延迟加载
            $(window).scroll(function(){
                var target = $(that).children().eq(0).children().last();
                if ($(target).offset().top  - document.documentElement.clientHeight < document.documentElement.scrollTop) {
                    dataBorder.start = dataBorder.end;
                    dataBorder.end = dataBorder.end + 30;
                    setData()
                }
            })
        }

        function addPagination() {
        }

        function setData() {

            var str = "";
            for (var i = dataBorder.start; i < dataBorder.end; i++) {
                str += '<tr>'
                for (var j = 0; j < settings.data[i].length; j++) {
                    str += '<td>' + settings.data[i][j] + '</td>'
                }
                str += '</tr>'
            }
            $(that).children().eq(0).append(str);
        }

        function setTitle() {
            var str = "<tr>";
            var title = !settings.dataHasTitle ? settings.title : settings.data[0];
            for(var  i = 0; i < title.length; i++) {
                str += '<th>' + title[i] +'</th>';
            }
            str += '</tr>';
            $(that).children().eq(0).html(str)

        }
    }
})(jQuery);