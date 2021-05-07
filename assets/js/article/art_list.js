$(function() {
    // 从 layui 中获取 from 和 layer、laypage对象的模块
    var form = layui.form;
    var layer = layui.layer;
    var laypage = layui.laypage;
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    };
    // 定义补零函数
    function padZero(n) {
        if (n < 10) {
            return '0' + n
        } else {
            return n
        }
        // 三元运算符
        // return n > 9 ? n : '0' + n;
    }
    // 定义一个查询参数对象，将来请求数据的时候
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 id
        state: '' //文章的发布状态
    };
    // 加载文章数据列表的数据
    layer.load(3, { time: 1500 });
    // 2 秒后文章数据列表的方法
    setTimeout(() => {
        initTable();
    }, 2000);
    // 调用文章分类数据的方法
    initCate();
    // 获取文章数据列表的方法
    function initTable() {
        // 发起 Ajax 数据请求
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！', { icon: 2, time: 1200 });
                }
                // layer.msg('获取文章列表成功！', { icon: 1, time: 1200 });
                // 使用模板引擎来渲染页面的数据
                var htmlStr = template('tpl-table', res)
                    // console.log(htmlStr);
                $('tbody').html(htmlStr);
                // 调用渲染分页的方法
                renderPage(res.total);
            }
        })
    };

    // 获取文章分类数据的方法
    function initCate() {
        // 发起 Ajax 数据请求
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！', { icon: 2, time: 1500 })
                }
                // layer.msg('获取文章分类列表成功！', { icon: 1, time: 1500 })
                // 调用模板引擎来渲染分类的可选项
                var htmlStr = template('tpl-cate', res);
                // console.log(htmlStr);
                $('#cate_id').html(htmlStr);
                // 通过 layui 的form.render()方法重新渲染表单区域的 UI 结构
                form.render();
            }
        })
    };
    // 为筛选表单绑定 submit 事件
    $('#form-search').on('submit', function(e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        // 获取表单中选中项的值
        var cate_id = $('#cate_id').val();
        var state = $('#state').val();
        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 加载筛选文章数据列表的最新数据
        layer.load(3, { time: 1500 });
        // 根据最新的筛选条件，在 2 秒之后重新渲染表格的数据
        setTimeout(() => {
            initTable();
        }, 2000)
    });
    // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            // 分页容器的 ID
            elem: 'pageBox', //注意，这里的 pageBox 是 ID，不用加 # 号
            // 总数据条数，从服务器获取的总条数 total
            count: total,
            // 每页显示几条数据
            limit: q.pagesize,
            // 设置默认被选中的分页
            curr: q.pagenum,
            // 自定义排版可选值有：count（总条目输区域）、prev（上一页区域）、page（分页区域）、next（下一页区域）、limit（条目选项区域）、refresh（页面刷新区域。
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 每页条数的选择项
            limits: [2, 3, 5, 10],
            // 当分页发生切换的时候，触发 jump 函数回调
            // 触发 jump 回调函数的方式有两种
            // 1. 方式 1：点击页码的时候，会触发 jump 回调
            // 2. 方式 2：只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function(obj, first) {
                // 可以通过 first 的值，来判断是通过哪种方式来触发 jump 回调
                // 如果 first 的值为 true 证明是触发的是方式 2
                // 如果 first 的值为 false 证明是触发的是方式 1
                // console.log(obj.curr);
                // 把最新的页码值，赋值到 q 这个查询参数对象的 pagenum 属性中
                q.pagenum = obj.curr;
                // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit;
                // 根据最新的 q  获取对应的数据列表，并渲染表格
                if (!first) {
                    //do something
                    // 加载文章数据列表的数据
                    layer.load(3, { time: 1200 });
                    // 2 秒后文章数据列表的方法
                    setTimeout(() => {
                        initTable();
                    }, 1800)
                }
            }
        })
    };

    // var indexEdit = null;
    // $('tbody').on('click', '.btn-edit', function() {
    //     // console.log('ok');
    //     indexEdit = layer.open({
    //         type: 1,
    //         area: ['500px', '250px'],
    //         title: '修改文章分类',
    //         content: $('#dialog-edit').html()
    //     });
    //     var id = $(this).attr('data-id');
    //     // console.log(id);
    //     // 发起 Ajax 请求获取对应的分类数据
    //     $.ajax({
    //         method: 'GET',
    //         url: '/my/article/cates/' + id,
    //         success: function(res) {
    //             // console.log(res);
    //             // 调用 from.val() 快速为表单赋值
    //             // 属性 lay-filter="form-edit" 对应的值
    //             // 第二个参数中的键值是表单元素对应的 name 和 value
    //             form.val('form-edit', res.data);
    //         }
    //     })
    // });

    // 通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function() {
        // 获取文章列表的 id
        var id = $(this).attr('data-id');
        // 获取删除按钮的个数
        var len = $('.btn-delete').length;
        console.log(len);
        // console.log('ok');
        // 询问用户是否要删除
        layer.confirm('您确定要删除?', { icon: 3, title: '温馨提示' }, function(index) {
            //do something
            // 发起 Ajax 数据请求
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除失败！', { icon: 2, time: 2000 })
                    }
                    layer.msg('已删除！', { icon: 1, time: 2000 });
                    // 当数据删除完成后，需要判断当前着一页中，是否还有剩余的数据
                    // 如果没有剩余的数据了，则让页码值 -1 之后
                    if (len === 1) {
                        // 如果 len 的值等于 1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    // 再2秒过后重新调用 initTable() 方法
                    setTimeout(() => {
                        initTable();
                    }, 2000);
                }
            });
            // 关闭弹出层
            layer.close(index);
        })
    })
})