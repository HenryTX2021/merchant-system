/**
 * SLA相关工具函数
 */

/**
 * 计算SLA剩余时间（小时）
 * @param {string} status - 订单状态
 * @param {string} orderTime - 下单时间，格式：YYYY-MM-DD HH:MM
 * @returns {number} - SLA剩余小时数
 */
export const calculateRemainingSlA = (status, orderTime) => {
  // 模拟不同状态的SLA时间（小时）
  const SLA_HOURS = {
    // 原有状态
    merchant_pending_shipment: 24,    // 商家待发货：24小时
    merchant_shipped: 48,            // 商家已发货：48小时
    domestic_warehouse_processing: 72, // 国内仓处理中：72小时
    main_line_transport: 120,        // 干线运输中：120小时
    overseas_warehouse_processing: 48, // 海外仓处理中：48小时
    overseas_warehouse_shipped: 0,   // 海外仓已出库：0小时（已完成）
    
    // 新增状态
    pending: 24,                     // 待处理：24小时
    packed: 12,                      // 已打包：12小时
    ready_to_ship: 24,               // 待发货：24小时
    shipped: 72,                     // 已发货：72小时
    delivered: 0,                    // 已送达：0小时（已完成）
    failed_delivery: 48,             // 配送失败：48小时（重新安排配送）
  };
  
  // 获取当前状态的SLA总时间
  const totalSlaHours = SLA_HOURS[status] || 0;
  if (totalSlaHours === 0) return 0;
  
  // 解析订单时间
  const orderDate = new Date(orderTime.replace(/-/g, '/'));
  const currentDate = new Date();
  
  // 计算已经过去的小时数
  const elapsedHours = Math.floor((currentDate - orderDate) / (1000 * 60 * 60));
  
  // 计算剩余小时数
  const remainingHours = Math.max(0, totalSlaHours - elapsedHours);
  
  return remainingHours;
};

/**
 * 格式化SLA剩余时间显示
 * @param {number} hours - 剩余小时数
 * @returns {string} - 格式化后的剩余时间
 */
export const formatRemainingSlA = (hours) => {
  if (hours <= 0) return '已完成';
  
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  if (days > 0) {
    return `${days}天${remainingHours}小时`;
  }
  
  return `${remainingHours}小时`;
};