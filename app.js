const { createApp, ref, computed } = Vue;

createApp({
  setup() {
    // 页面标识
    const page = ref('list')
    // 商品列表
    const productList = ref(rawProductList)
    // 当前详情商品
    const currentProduct = ref(null)
    // 购物车数组
    const cartList = ref([])

    // 读取本地购物车
    if(localStorage.getItem('fruitCart')){
      cartList.value = JSON.parse(localStorage.getItem('fruitCart'))
    }

    // 计算购物车总数量
    const cartCount = computed(()=>{
      return cartList.value.reduce((sum,item)=>sum + item.quantity,0)
    })

    // 计算总价
    const totalPrice = computed(()=>{
      return cartList.value.reduce((sum,item)=>sum + item.price * item.quantity,0).toFixed(2)
    })

    // 跳转详情页
    const goDetail = (id)=>{
      // 根据id查找商品
      const product = productList.value.find(item=>item.id === id)
      // 找到再赋值跳转
      if(product){
        currentProduct.value = product
        page.value = 'detail'
      }
    }

    // 返回列表
    const goBack = ()=>{
      page.value = 'list'
      currentProduct.value = null
    }

    // 打开购物车
    const viewCart = ()=>{
      page.value = 'cart'
    }

    // 加入购物车
    const addToCart = (goods)=>{
      // 判断购物车是否已有该商品
      const hasGoods = cartList.value.find(item=>item.id === goods.id)
      if(hasGoods){
        hasGoods.quantity += 1
      }else{
        cartList.value.push({
          id:goods.id,
          name:goods.name,
          price:goods.price,
          quantity:1
        })
      }
      // 存入本地存储
      localStorage.setItem('fruitCart',JSON.stringify(cartList.value))
      alert('加入购物车成功')
    }

    // 删除购物车商品
    const removeFromCart = (index)=>{
      cartList.value.splice(index,1)
      localStorage.setItem('fruitCart',JSON.stringify(cartList.value))
    }

    // 结算订单
    const checkout = ()=>{
      if(cartList.value.length === 0){
        alert('购物车空空如也')
        return
      }
      alert(`下单成功，应付金额：${totalPrice.value} 元`)
      // 清空购物车
      cartList.value = []
      localStorage.removeItem('fruitCart')
      page.value = 'list'
    }

    return {
      page,
      productList,
      currentProduct,
      cartList,
      cartCount,
      totalPrice,
      goDetail,
      goBack,
      viewCart,
      addToCart,
      removeFromCart,
      checkout
    }
  }
}).mount('#app')