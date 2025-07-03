/**
 * 订单状态常量和工具函数
 */

// 订单状态常量
export const ORDER_STATUS = {
  // 原有状态
  MERCHANT_PENDING_SHIPMENT: 'merchant_pending_shipment',  // 商家待发货
  MERCHANT_SHIPPED: 'merchant_shipped',  // 商家已发货
  DOMESTIC_WAREHOUSE_PROCESSING: 'domestic_warehouse_processing',  // 国内仓处理中
  MAIN_LINE_TRANSPORT: 'main_line_transport',  // 干线运输中
  OVERSEAS_WAREHOUSE_PROCESSING: 'overseas_warehouse_processing',  // 海外仓处理中
  OVERSEAS_WAREHOUSE_SHIPPED: 'overseas_warehouse_shipped',  // 海外仓已出库
  
  // 新增状态
  PENDING: 'pending',                // 待处理
  PACKED: 'packed',                  // 已打包
  READY_TO_SHIP: 'ready_to_ship',    // 待发货
  SHIPPED: 'shipped',                // 已发货
  DELIVERED: 'delivered',            // 已送达
  FAILED_DELIVERY: 'failed_delivery', // 配送失败
  CANCELED: 'canceled'               // 已取消
};

// 订单状态文本映射
export const ORDER_STATUS_TEXT = {
  // 原有状态文本
  [ORDER_STATUS.MERCHANT_PENDING_SHIPMENT]: '商家待发货',
  [ORDER_STATUS.MERCHANT_SHIPPED]: '商家已发货',
  [ORDER_STATUS.DOMESTIC_WAREHOUSE_PROCESSING]: '国内仓处理中',
  [ORDER_STATUS.MAIN_LINE_TRANSPORT]: '干线运输中',
  [ORDER_STATUS.OVERSEAS_WAREHOUSE_PROCESSING]: '海外仓处理中',
  [ORDER_STATUS.OVERSEAS_WAREHOUSE_SHIPPED]: '海外仓已出库',
  
  // 新增状态文本
  [ORDER_STATUS.PENDING]: '待处理',
  [ORDER_STATUS.PACKED]: '已打包',
  [ORDER_STATUS.READY_TO_SHIP]: '待发货',
  [ORDER_STATUS.SHIPPED]: 'shipped',
  [ORDER_STATUS.DELIVERED]: '已送达',
  [ORDER_STATUS.FAILED_DELIVERY]: '配送失败',
  [ORDER_STATUS.CANCELED]: '已取消'
};

// 订单状态颜色映射
export const ORDER_STATUS_COLOR = {
  // 原有状态颜色
  [ORDER_STATUS.MERCHANT_PENDING_SHIPMENT]: '#ff8f1f',  // 橙色
  [ORDER_STATUS.MERCHANT_SHIPPED]: '#faad14',  // 黄色
  [ORDER_STATUS.DOMESTIC_WAREHOUSE_PROCESSING]: '#1677ff',  // 蓝色
  [ORDER_STATUS.MAIN_LINE_TRANSPORT]: '#1677ff',  // 蓝色
  [ORDER_STATUS.OVERSEAS_WAREHOUSE_PROCESSING]: '#1677ff',  // 蓝色
  [ORDER_STATUS.OVERSEAS_WAREHOUSE_SHIPPED]: '#00b578',  // 绿色
  
  // 新增状态颜色
  [ORDER_STATUS.PENDING]: '#ff8f1f',       // 橙色
  [ORDER_STATUS.PACKED]: '#faad14',        // 黄色
  [ORDER_STATUS.READY_TO_SHIP]: '#ff8f1f', // 橙色
  [ORDER_STATUS.SHIPPED]: '#1677ff',       // 蓝色
  [ORDER_STATUS.DELIVERED]: '#00b578',     // 绿色
  [ORDER_STATUS.FAILED_DELIVERY]: '#ff4d4f', // 红色
  [ORDER_STATUS.CANCELED]: '#cccccc'       // 灰色
};

/**
 * 获取订单状态标签
 * @param {string} status - 订单状态
 * @returns {object} - 包含颜色和文本的对象
 */
export const getOrderStatusInfo = (status) => {
  return {
    text: ORDER_STATUS_TEXT[status] || '未知状态',
    color: ORDER_STATUS_COLOR[status] || '#999',
  };
};

/**
 * 获取订单状态流程步骤
 * @returns {Array} - 订单状态流程步骤数组
 */
export const getOrderStatusSteps = () => [
  {
    title: ORDER_STATUS_TEXT[ORDER_STATUS.MERCHANT_PENDING_SHIPMENT],
    description: '商家准备货物并安排发货',
  },
  {
    title: ORDER_STATUS_TEXT[ORDER_STATUS.MERCHANT_SHIPPED],
    description: '商家已完成发货，货物在途中',
  },
  {
    title: ORDER_STATUS_TEXT[ORDER_STATUS.DOMESTIC_WAREHOUSE_PROCESSING],
    description: '国内仓库接收货物并进行处理',
  },
  {
    title: ORDER_STATUS_TEXT[ORDER_STATUS.MAIN_LINE_TRANSPORT],
    description: '货物通过干线运输到目的地',
  },
  {
    title: ORDER_STATUS_TEXT[ORDER_STATUS.OVERSEAS_WAREHOUSE_PROCESSING],
    description: '海外仓库接收货物并进行处理',
  },
  {
    title: ORDER_STATUS_TEXT[ORDER_STATUS.OVERSEAS_WAREHOUSE_SHIPPED],
    description: '海外仓库完成处理并发出货物',
  },
];