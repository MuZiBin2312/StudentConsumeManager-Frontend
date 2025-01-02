module.exports = {
    devServer: {
        proxy: {
            '/trade': {
                target: 'http://192.168.3.91:10085', // 后端地址
                changeOrigin: true, // 修改请求头中的Origin字段，避免跨域
                pathRewrite: {
                    '^/trade': '', // 去掉请求中的 /trade 前缀
                },
            },
        },
    },
};
