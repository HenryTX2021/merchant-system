import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Tabs, List, Input, Tag, Button, Dialog, Form, DatePicker, TextArea, Selector, Steps, Collapse } from 'antd-mobile';
import { SearchOutline, RightOutline, AddOutline, DownOutline, UpOutline, DownOutline as DownloadOutline } from 'antd-mobile-icons';
import { ORDER_STATUS, getOrderStatusInfo, getOrderStatusSteps } from '../../utils/orderStatus';
import * as XLSX from 'xlsx';
import './style.css';
import '../../styles/common.css';

// 字段标签常量
const FIELD_LABELS = {
  actualFreight: '运费',
  billingWeight: '计费重',
  latestOperation: '最近操作',
  cancelTime: '取消时间',
  shippingFrom: '发货地'
};

// 单位常量
const UNITS = {
  weight: 'g',
  money: '元'
};

// 数据格式化函数
const formatWeight = (weight, defaultValue = '0.00') => 
  weight ? `${weight} ${UNITS.weight}` : `${defaultValue} ${UNITS.weight}`;

const formatMoney = (amount, defaultValue = '0.00') => 
  amount ? `${amount} ${UNITS.money}` : `${defaultValue} ${UNITS.money}`;

// 可复用的字段渲染组件
const OrderField = ({ label, value, formatter, className }) => (
  <div className={className}>
    {label && `${label}: `}
    {formatter ? formatter(value) : value}
  </div>
);

// 获取最近的操作时间
const getLatestOperation = (operationTimes) => {
  if (!operationTimes) return '暂无操作';
  
  const operations = [
    { key: 'overseasWarehouseShipmentTime', label: '海外仓出库' },
    { key: 'overseasWarehouseOrderChangeTime', label: '海外仓换单' },
    { key: 'overseasWarehouseReceiptTime', label: '海外仓收货' },
    { key: 'domesticWarehouseShipmentTime', label: '国内仓出库' },
    { key: 'domesticWarehousePackingTime', label: '国内仓组包' },
    { key: 'domesticWarehouseReceiptTime', label: '国内仓收货' },
    { key: 'merchantShipmentTime', label: '商家发货' },
  ];
  
  for (const op of operations) {
    if (operationTimes[op.key] && operationTimes[op.key].trim && operationTimes[op.key].trim() !== '') {
      return `${op.label} ${operationTimes[op.key]}`;
    }
  }
  
  return '暂无操作';
};

// 日期工具函数
const formatDate = (date) => {
  if (!date) return '';
  if (typeof date === 'string') return date;
  return date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0].substring(0, 5);
};

const isToday = (dateStr) => {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);
  
  return date.getTime() === today.getTime();
};

const isYesterday = (dateStr) => {
  if (!dateStr) return false;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  
  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);
  
  return date.getTime() === yesterday.getTime();
};

const isWithinLastWeek = (dateStr) => {
  if (!dateStr) return false;
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  lastWeek.setHours(0, 0, 0, 0);
  
  const date = new Date(dateStr);
  
  return date >= lastWeek;
};

const isWithinLastMonth = (dateStr) => {
  if (!dateStr) return false;
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  lastMonth.setHours(0, 0, 0, 0);
  
  const date = new Date(dateStr);
  
  return date >= lastMonth;
};

const isWithinDateRange = (dateStr, startDate, endDate) => {
  if (!dateStr || !startDate || !endDate) return false;
  
  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);
  
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  
  return date >= start && date <= end;
};

const OrderCenter = () => {
  const history = useHistory();
  const [activeTab, setActiveTab] = useState('all'); // 修改默认选项卡为'all'
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const formRef = useRef(null);
  const [filteredStatus, setFilteredStatus] = useState('');
  const [filteredDarazOrders, setFilteredDarazOrders] = useState([]);
  const [filteredExpressOrders, setFilteredExpressOrders] = useState([]);
  
  // 多条件查询状态
  const [advancedSearchVisible, setAdvancedSearchVisible] = useState(false);
  const [arlWaybillNos, setArlWaybillNos] = useState('');
  const [darazOrderNos, setDarazOrderNos] = useState('');
  const [selectedArlStatuses, setSelectedArlStatuses] = useState([]);
  const [selectedDarazStatuses, setSelectedDarazStatuses] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  // 从sessionStorage读取状态筛选条件
  useEffect(() => {
    const statusFilter = sessionStorage.getItem('filterOrderStatus');
    if (statusFilter) {
      setFilteredStatus(statusFilter);
      // 清除sessionStorage中的筛选条件，避免刷新页面后仍然应用筛选
      sessionStorage.removeItem('filterOrderStatus');
    }
  }, []);
  
  // ARL运单状态选项
  const arlStatusOptions = [
    { label: '商家待发货', value: ORDER_STATUS.MERCHANT_PENDING_SHIPMENT },
    { label: '商家已发货', value: ORDER_STATUS.MERCHANT_SHIPPED },
    { label: '国内仓处理中', value: ORDER_STATUS.DOMESTIC_WAREHOUSE_PROCESSING },
    { label: '干线运输中', value: ORDER_STATUS.MAIN_LINE_TRANSPORT },
    { label: '海外仓处理中', value: ORDER_STATUS.OVERSEAS_WAREHOUSE_PROCESSING },
    { label: '海外仓已出库', value: ORDER_STATUS.OVERSEAS_WAREHOUSE_SHIPPED },
  ];
  
  // Daraz订单状态选项
  const darazStatusOptions = [
    { label: '待处理', value: 'pending' },
    { label: '待发货', value: 'ready_to_ship' },
    { label: '已发货', value: 'shipped' },
    { label: '已送达', value: 'delivered' },
    { label: '已取消', value: 'canceled' },
  ];
  
  // 取消节点筛选选项
  const cancelNodeOptions = [
    { label: '国内仓收货前', value: 'before_domestic_receipt', statuses: [ORDER_STATUS.MERCHANT_PENDING_SHIPMENT, ORDER_STATUS.MERCHANT_SHIPPED] },
    { label: '国内仓已收货', value: 'domestic_receipt', statuses: [ORDER_STATUS.DOMESTIC_WAREHOUSE_PROCESSING] },
    { label: '国内库出库后', value: 'after_domestic_shipment', statuses: [ORDER_STATUS.MAIN_LINE_TRANSPORT] },
    { label: '海外仓换单后', value: 'after_overseas_order_change', statuses: [ORDER_STATUS.OVERSEAS_WAREHOUSE_PROCESSING, ORDER_STATUS.OVERSEAS_WAREHOUSE_SHIPPED] },
  ];
  
  // 取消时间筛选选项
  const cancelTimeOptions = [
    { label: '今天', value: 'today' },
    { label: '昨天', value: 'yesterday' },
    { label: '最近一周', value: 'last_week' },
    { label: '最近一个月', value: 'last_month' },
    { label: '自定义时间', value: 'custom' },
  ];
  
  // 发货地筛选选项
  const shippingFromOptions = [
    { label: 'BD仓', value: 'bd_warehouse' },
    { label: 'PK仓', value: 'pk_warehouse' },
    { label: '国内', value: 'domestic' },
  ];
  
  // 取消节点状态
  const [selectedCancelNode, setSelectedCancelNode] = useState('');
  // 取消时间状态
  const [selectedCancelTime, setSelectedCancelTime] = useState('');
  // 发货地状态
  const [selectedShippingFrom, setSelectedShippingFrom] = useState([]);
  const [customDateRange, setCustomDateRange] = useState([null, null]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // 使用useMemo缓存订单数据，避免每次渲染重新创建数组
  const darazOrders = useMemo(() => {
    // 模拟订单数据 - 与仪表盘显示数量一致
    return [
      // 商家待发货 - 3个
      {
        arlWaybillNo: 'PK2025070100006',
        arlStatus: ORDER_STATUS.MERCHANT_PENDING_SHIPMENT,
        darazOrderNo: '219197383846276',
        darazStatus: 'pending',
        darazSLARemaining: '31.4hrs',
        shopName: 'ARLtest',
        destinationCountry: 'Pakistan',
        cargoType: '普货',
        actualFreight: '2.85',
        billingWeight: '10',
        shippingFrom: 'pk_warehouse', // 发货地：PK仓
        operationTimes: {
          merchantShipmentTime: '2025-03-29 14:36:35',
          domesticWarehouseReceiptTime: '2025-04-03 17:38:29',
          domesticWarehousePackingTime: '2025-04-03 17:48:29',
          domesticWarehouseShipmentTime: '2025-04-03 18:11:3',
          overseasWarehouseReceiptTime: '2025-04-10 00:00:00',
          overseasWarehouseOrderChangeTime: '2025-04-11 17:36:20',
          overseasWarehouseShipmentTime: '2025-04-11 17:36:20',
        },
        trackingNumber: 'RDX-BD-0020314387',
      },
      {
        arlWaybillNo: 'PK2025070100007',
        arlStatus: ORDER_STATUS.MERCHANT_PENDING_SHIPMENT,
        darazOrderNo: '219197383846277',
        darazStatus: 'pending',
        darazSLARemaining: '28.2hrs',
        shopName: 'ARLtest',
        destinationCountry: 'Pakistan',
        cargoType: '敏货',
        actualFreight: '3.25',
        billingWeight: '12.5',
        shippingFrom: 'bd_warehouse', // 发货地：BD仓
        operationTimes: {
          merchantShipmentTime: '2025-03-29 15:20:40',
          domesticWarehouseReceiptTime: '',
          domesticWarehousePackingTime: '',
          domesticWarehouseShipmentTime: '',
          overseasWarehouseReceiptTime: '',
          overseasWarehouseOrderChangeTime: '',
          overseasWarehouseShipmentTime: '',
        },
        trackingNumber: '',
      },
      {
        arlWaybillNo: 'PK2025070100008',
        arlStatus: ORDER_STATUS.MERCHANT_PENDING_SHIPMENT,
        darazOrderNo: '219197383846278',
        darazStatus: 'pending',
        darazSLARemaining: '24.5hrs',
        shopName: 'ARLtest',
        destinationCountry: 'Pakistan',
        cargoType: '特殊普',
        actualFreight: '4.15',
        billingWeight: '15.75',
        shippingFrom: 'domestic', // 发货地：国内
        operationTimes: {
          merchantShipmentTime: '2025-03-29 16:45:22',
          domesticWarehouseReceiptTime: '',
          domesticWarehousePackingTime: '',
          domesticWarehouseShipmentTime: '',
          overseasWarehouseReceiptTime: '',
          overseasWarehouseOrderChangeTime: '',
          overseasWarehouseShipmentTime: '',
        },
        trackingNumber: '',
      },
      
      // 商家已发货 - 2个
      {
        arlWaybillNo: 'PK2025070100009',
        arlStatus: ORDER_STATUS.MERCHANT_SHIPPED,
        darazOrderNo: '219197383846279',
        darazStatus: 'ready_to_ship',
        darazSLARemaining: '20.8hrs',
        shopName: 'ARLtest',
        destinationCountry: 'Pakistan',
        cargoType: '特殊敏',
        actualFreight: '2.35',
        billingWeight: '8.5',
        operationTimes: {
          merchantShipmentTime: '2025-03-30 09:15:30',
          domesticWarehouseReceiptTime: '',
          domesticWarehousePackingTime: '',
          domesticWarehouseShipmentTime: '',
          overseasWarehouseReceiptTime: '',
          overseasWarehouseOrderChangeTime: '',
          overseasWarehouseShipmentTime: '',
        },
        trackingNumber: '',
      },
      {
        arlWaybillNo: 'PK2025070100010',
        arlStatus: ORDER_STATUS.MERCHANT_SHIPPED,
        darazOrderNo: '219197383846280',
        darazStatus: 'ready_to_ship',
        darazSLARemaining: '18.3hrs',
        shopName: 'ARLtest',
        destinationCountry: 'Pakistan',
        cargoType: '普货',
        actualFreight: '3.75',
        billingWeight: '14.25',
        shippingFrom: 'domestic', // 发货地：国内
        operationTimes: {
          merchantShipmentTime: '2025-03-30 10:40:15',
          domesticWarehouseReceiptTime: '',
          domesticWarehousePackingTime: '',
          domesticWarehouseShipmentTime: '',
          overseasWarehouseReceiptTime: '',
          overseasWarehouseOrderChangeTime: '',
          overseasWarehouseShipmentTime: '',
        },
        trackingNumber: '',
      },
      
      // 在darazOrders数组末尾添加已取消订单示例
      // 已取消订单 - 3个
      {
        arlWaybillNo: 'PK2025070100023',
        arlStatus: ORDER_STATUS.MERCHANT_PENDING_SHIPMENT,
        darazOrderNo: '219197383846293',
        darazStatus: 'canceled',
        darazSLARemaining: '0hrs',
        shopName: 'ARLtest',
        destinationCountry: 'Pakistan',
        cargoType: '普货',
        actualFreight: '4.25',
        billingWeight: '16.5',
        cancelTime: '2025-04-05 09:15:25', // 今天取消的订单
        shippingFrom: 'pk_warehouse', // 发货地：PK仓
        operationTimes: {
          merchantShipmentTime: '2025-04-04 09:15:25',
          domesticWarehouseReceiptTime: '',
          domesticWarehousePackingTime: '',
          domesticWarehouseShipmentTime: '',
          overseasWarehouseReceiptTime: '',
          overseasWarehouseOrderChangeTime: '',
          overseasWarehouseShipmentTime: '',
        },
        trackingNumber: '',
      },
      {
        arlWaybillNo: 'PK2025070100024',
        arlStatus: ORDER_STATUS.MERCHANT_SHIPPED,
        darazOrderNo: '219197383846294',
        darazStatus: 'canceled',
        darazSLARemaining: '0hrs',
        shopName: 'ARLtest',
        destinationCountry: 'Pakistan',
        cargoType: '敏货',
        actualFreight: '3.65',
        billingWeight: '14.2',
        cancelTime: '2025-04-04 10:25:35', // 昨天取消的订单
        shippingFrom: 'bd_warehouse', // 发货地：BD仓
        operationTimes: {
          merchantShipmentTime: '2025-04-04 10:25:35',
          domesticWarehouseReceiptTime: '',
          domesticWarehousePackingTime: '',
          domesticWarehouseShipmentTime: '',
          overseasWarehouseReceiptTime: '',
          overseasWarehouseOrderChangeTime: '',
          overseasWarehouseShipmentTime: '',
        },
        trackingNumber: '',
      },
      {
        arlWaybillNo: 'PK2025070100025',
        arlStatus: ORDER_STATUS.DOMESTIC_WAREHOUSE_PROCESSING,
        darazOrderNo: '219197383846295',
        darazStatus: 'canceled',
        darazSLARemaining: '0hrs',
        shopName: 'ARLtest',
        destinationCountry: 'Pakistan',
        cargoType: '普货',
        actualFreight: '5.15',
        billingWeight: '20.1',
        cancelTime: '2025-03-30 11:35:45', // 一周前取消的订单
        shippingFrom: 'domestic', // 发货地：国内
        operationTimes: {
          merchantShipmentTime: '2025-04-04 11:35:45',
          domesticWarehouseReceiptTime: '2025-04-08 09:25:35',
          domesticWarehousePackingTime: '',
          domesticWarehouseShipmentTime: '',
          overseasWarehouseReceiptTime: '',
          overseasWarehouseOrderChangeTime: '',
          overseasWarehouseShipmentTime: '',
        },
        trackingNumber: 'RDX-BD-0020314400',
      },
      // 添加更多取消订单示例，用于测试不同时间段的筛选
      {
        arlWaybillNo: 'PK2025070100026',
        arlStatus: ORDER_STATUS.MAIN_LINE_TRANSPORT,
        darazOrderNo: '219197383846296',
        darazStatus: 'canceled',
        darazSLARemaining: '0hrs',
        shopName: 'ARLtest',
        destinationCountry: 'Pakistan',
        cargoType: '普货',
        actualFreight: '4.75',
        billingWeight: '18.5',
        cancelTime: '2025-03-15 14:25:35', // 一个月内取消的订单
        shippingFrom: 'pk_warehouse', // 发货地：PK仓
        operationTimes: {
          merchantShipmentTime: '2025-03-10 09:15:25',
          domesticWarehouseReceiptTime: '2025-03-14 10:25:35',
          domesticWarehousePackingTime: '2025-03-14 11:35:45',
          domesticWarehouseShipmentTime: '2025-03-14 12:45:55',
          overseasWarehouseReceiptTime: '',
          overseasWarehouseOrderChangeTime: '',
          overseasWarehouseShipmentTime: '',
        },
        trackingNumber: 'RDX-BD-0020314401',
      },
      {
        arlWaybillNo: 'PK2025070100027',
        arlStatus: ORDER_STATUS.OVERSEAS_WAREHOUSE_PROCESSING,
        darazOrderNo: '219197383846297',
        darazStatus: 'canceled',
        darazSLARemaining: '0hrs',
        shopName: 'ARLtest',
        destinationCountry: 'Pakistan',
        cargoType: '敏货',
        actualFreight: '5.25',
        billingWeight: '20.5',
        cancelTime: '2025-02-20 16:35:45', // 超过一个月取消的订单
        shippingFrom: 'bd_warehouse', // 发货地：BD仓
        operationTimes: {
          merchantShipmentTime: '2025-02-15 10:25:35',
          domesticWarehouseReceiptTime: '2025-02-18 11:35:45',
          domesticWarehousePackingTime: '2025-02-18 12:45:55',
          domesticWarehouseShipmentTime: '2025-02-18 13:55:05',
          overseasWarehouseReceiptTime: '2025-02-19 14:25:35',
          overseasWarehouseOrderChangeTime: '',
          overseasWarehouseShipmentTime: '',
        },
        trackingNumber: 'RDX-BD-0020314402',
      },

      // 国内仓处理中 - 3个
      {
        arlWaybillNo: 'PK2025070100011',
        arlStatus: ORDER_STATUS.DOMESTIC_WAREHOUSE_PROCESSING,
        darazOrderNo: '219197383846281',
        darazStatus: 'ready_to_ship',
        darazSLARemaining: '15.6hrs',
        shopName: 'ARLtest',
        destinationCountry: 'Pakistan',
        cargoType: '普货',
        actualFreight: '5.25',
        billingWeight: '20.5',
        shippingFrom: 'domestic', // 发货地：国内
        operationTimes: {
          merchantShipmentTime: '2025-03-31 08:20:45',
          domesticWarehouseReceiptTime: '2025-04-04 10:15:30',
          domesticWarehousePackingTime: '',
          domesticWarehouseShipmentTime: '',
          overseasWarehouseReceiptTime: '',
          overseasWarehouseOrderChangeTime: '',
          overseasWarehouseShipmentTime: '',
        },
        trackingNumber: 'RDX-BD-0020314388',
      },
      {
        arlWaybillNo: 'PK2025070100012',
        arlStatus: ORDER_STATUS.DOMESTIC_WAREHOUSE_PROCESSING,
        darazOrderNo: '219197383846282',
        darazStatus: 'ready_to_ship',
        darazSLARemaining: '14.2hrs',
        shopName: 'ARLtest',
        destinationCountry: 'Pakistan',
        cargoType: '敏货',
        actualFreight: '4.55',
        billingWeight: '17.8',
        shippingFrom: 'pk_warehouse', // 发货地：PK仓
        operationTimes: {
          merchantShipmentTime: '2025-03-31 09:35:20',
          domesticWarehouseReceiptTime: '2025-04-04 11:25:40',
          domesticWarehousePackingTime: '',
          domesticWarehouseShipmentTime: '',
          overseasWarehouseReceiptTime: '',
          overseasWarehouseOrderChangeTime: '',
          overseasWarehouseShipmentTime: '',
        },
        trackingNumber: 'RDX-BD-0020314389',
      },
      {
        arlWaybillNo: 'PK2025070100013',
        arlStatus: ORDER_STATUS.DOMESTIC_WAREHOUSE_PROCESSING,
        darazOrderNo: '219197383846283',
        darazStatus: 'ready_to_ship',
        darazSLARemaining: '12.8hrs',
        shopName: 'ARLtest',
        destinationCountry: 'Pakistan',
        cargoType: '普货',
        actualFreight: '3.95',
        billingWeight: '15.2',
        shippingFrom: 'bd_warehouse', // 发货地：BD仓
        operationTimes: {
          merchantShipmentTime: '2025-03-31 10:50:15',
          domesticWarehouseReceiptTime: '2025-04-04 12:40:25',
          domesticWarehousePackingTime: '',
          domesticWarehouseShipmentTime: '',
          overseasWarehouseReceiptTime: '',
          overseasWarehouseOrderChangeTime: '',
          overseasWarehouseShipmentTime: '',
        },
        trackingNumber: 'RDX-BD-0020314390',
      },
      
      // 干线运输中 - 3个
      {
        arlWaybillNo: 'PK2025070100014',
        arlStatus: ORDER_STATUS.MAIN_LINE_TRANSPORT,
        darazOrderNo: '219197383846284',
        darazStatus: 'shipped',
        darazSLARemaining: '10.5hrs',
        shopName: 'ARLtest',
        destinationCountry: 'Pakistan',
        cargoType: '普货',
        actualFreight: '5.85',
        billingWeight: '22.5',
        operationTimes: {
          merchantShipmentTime: '2025-04-01 09:10:25',
          domesticWarehouseReceiptTime: '2025-04-05 11:20:35',
          domesticWarehousePackingTime: '2025-04-05 11:45:40',
          domesticWarehouseShipmentTime: '2025-04-05 12:30:45',
          overseasWarehouseReceiptTime: '',
          overseasWarehouseOrderChangeTime: '',
          overseasWarehouseShipmentTime: '',
        },
        trackingNumber: 'RDX-BD-0020314391',
      },
      {
        arlWaybillNo: 'PK2025070100015',
        arlStatus: ORDER_STATUS.MAIN_LINE_TRANSPORT,
        darazOrderNo: '219197383846285',
        darazStatus: 'shipped',
        darazSLARemaining: '9.2hrs',
        shopName: 'ARLtest',
        destinationCountry: 'Pakistan',
        cargoType: '敏货',
        actualFreight: '4.25',
        billingWeight: '16.75',
        operationTimes: {
          merchantShipmentTime: '2025-04-01 10:25:35',
          domesticWarehouseReceiptTime: '2025-04-05 12:35:45',
          domesticWarehousePackingTime: '2025-04-05 13:10:50',
          domesticWarehouseShipmentTime: '2025-04-05 13:45:55',
          overseasWarehouseReceiptTime: '',
          overseasWarehouseOrderChangeTime: '',
          overseasWarehouseShipmentTime: '',
        },
        trackingNumber: 'RDX-BD-0020314392',
      },
      {
        arlWaybillNo: 'PK2025070100016',
        arlStatus: ORDER_STATUS.MAIN_LINE_TRANSPORT,
        darazOrderNo: '219197383846286',
        darazStatus: 'shipped',
        darazSLARemaining: '8.4hrs',
        shopName: 'ARLtest',
        destinationCountry: 'Pakistan',
        cargoType: '普货',
        actualFreight: '6.15',
        billingWeight: '24',
        operationTimes: {
          merchantShipmentTime: '2025-04-01 11:40:45',
          domesticWarehouseReceiptTime: '2025-04-05 14:15:25',
          domesticWarehousePackingTime: '2025-04-05 14:45:30',
          domesticWarehouseShipmentTime: '2025-04-05 15:20:35',
          overseasWarehouseReceiptTime: '',
          overseasWarehouseOrderChangeTime: '',
          overseasWarehouseShipmentTime: '',
        },
        trackingNumber: 'RDX-BD-0020314393',
      },
      
      // 海外仓处理中 - 1个
      {
        arlWaybillNo: 'PK2025070100017',
        arlStatus: ORDER_STATUS.OVERSEAS_WAREHOUSE_PROCESSING,
        darazOrderNo: '219197383846287',
        darazStatus: 'shipped',
        darazSLARemaining: '6.8hrs',
        shopName: 'ARLtest',
        destinationCountry: 'Pakistan',
        cargoType: '普货',
        actualFreight: '4.75',
        billingWeight: '18.5',
        operationTimes: {
          merchantShipmentTime: '2025-04-02 08:30:15',
          domesticWarehouseReceiptTime: '2025-04-06 10:25:35',
          domesticWarehousePackingTime: '2025-04-06 10:55:40',
          domesticWarehouseShipmentTime: '2025-04-06 11:30:45',
          overseasWarehouseReceiptTime: '2025-04-12 09:15:25',
          overseasWarehouseOrderChangeTime: '',
          overseasWarehouseShipmentTime: '',
        },
        trackingNumber: 'RDX-BD-0020314394',
      },
      
      // 海外仓已出库 - 5个
      {
        arlWaybillNo: 'PK2025070100018',
        arlStatus: ORDER_STATUS.OVERSEAS_WAREHOUSE_SHIPPED,
        darazOrderNo: '219197383846288',
        darazStatus: 'delivered',
        darazSLARemaining: '0hrs',
        shopName: 'ARLtest',
        destinationCountry: 'Pakistan',
        cargoType: '普货',
        actualFreight: '5.35',
        billingWeight: '20.75',
        operationTimes: {
          merchantShipmentTime: '2025-04-03 09:45:25',
          domesticWarehouseReceiptTime: '2025-04-07 11:35:45',
          domesticWarehousePackingTime: '2025-04-07 12:05:50',
          domesticWarehouseShipmentTime: '2025-04-07 12:40:55',
          overseasWarehouseReceiptTime: '2025-04-13 10:25:35',
          overseasWarehouseOrderChangeTime: '2025-04-14 09:15:25',
          overseasWarehouseShipmentTime: '2025-04-14 09:15:25',
        },
        trackingNumber: 'RDX-BD-0020314395',
      },
      {
        arlWaybillNo: 'PK2025070100019',
        arlStatus: ORDER_STATUS.OVERSEAS_WAREHOUSE_SHIPPED,
        darazOrderNo: '219197383846289',
        darazStatus: 'delivered',
        darazSLARemaining: '0hrs',
        shopName: 'ARLtest',
        destinationCountry: 'Pakistan',
        cargoType: '普货',
        actualFreight: '3.85',
        billingWeight: '14.75',
        operationTimes: {
          merchantShipmentTime: '2025-04-03 10:55:35',
          domesticWarehouseReceiptTime: '2025-04-07 13:45:55',
          domesticWarehousePackingTime: '2025-04-07 14:15:00',
          domesticWarehouseShipmentTime: '2025-04-07 14:50:05',
          overseasWarehouseReceiptTime: '2025-04-13 11:35:45',
          overseasWarehouseOrderChangeTime: '2025-04-14 10:25:35',
          overseasWarehouseShipmentTime: '2025-04-14 10:25:35',
        },
        trackingNumber: 'RDX-BD-0020314396',
      },
      {
        arlWaybillNo: 'PK2025070100020',
        arlStatus: ORDER_STATUS.OVERSEAS_WAREHOUSE_SHIPPED,
        darazOrderNo: '219197383846290',
        darazStatus: 'delivered',
        darazSLARemaining: '0hrs',
        shopName: 'ARLtest',
        destinationCountry: 'Pakistan',
        cargoType: '普货',
        actualFreight: '5.65',
        billingWeight: '22',
        operationTimes: {
          merchantShipmentTime: '2025-04-03 12:05:45',
          domesticWarehouseReceiptTime: '2025-04-07 15:55:05',
          domesticWarehousePackingTime: '2025-04-07 16:25:10',
          domesticWarehouseShipmentTime: '2025-04-07 17:00:15',
          overseasWarehouseReceiptTime: '2025-04-13 12:45:55',
          overseasWarehouseOrderChangeTime: '2025-04-14 11:35:45',
          overseasWarehouseShipmentTime: '2025-04-14 11:35:45',
        },
        trackingNumber: 'RDX-BD-0020314397',
      },
      {
        arlWaybillNo: 'PK2025070100021',
        arlStatus: ORDER_STATUS.OVERSEAS_WAREHOUSE_SHIPPED,
        darazOrderNo: '219197383846291',
        darazStatus: 'delivered',
        darazSLARemaining: '0hrs',
        shopName: 'ARLtest',
        destinationCountry: 'Pakistan',
        cargoType: '普货',
        actualFreight: '4.45',
        billingWeight: '17.25',
        operationTimes: {
          merchantShipmentTime: '2025-04-03 13:15:55',
          domesticWarehouseReceiptTime: '2025-04-07 18:05:15',
          domesticWarehousePackingTime: '2025-04-07 18:35:20',
          domesticWarehouseShipmentTime: '2025-04-07 19:10:25',
          overseasWarehouseReceiptTime: '2025-04-13 13:55:05',
          overseasWarehouseOrderChangeTime: '2025-04-14 12:45:55',
          overseasWarehouseShipmentTime: '2025-04-14 12:45:55',
        },
        trackingNumber: 'RDX-BD-0020314398',
      },
      {
        arlWaybillNo: 'PK2025070100022',
        arlStatus: ORDER_STATUS.OVERSEAS_WAREHOUSE_SHIPPED,
        darazOrderNo: '219197383846292',
        darazStatus: 'delivered',
        darazSLARemaining: '0hrs',
        shopName: 'ARLtest',
        destinationCountry: 'Pakistan',
        cargoType: '普货',
        actualFreight: '3.55',
        billingWeight: '13.75',
        operationTimes: {
          merchantShipmentTime: '2025-04-03 14:25:05',
          domesticWarehouseReceiptTime: '2025-04-07 20:15:25',
          domesticWarehousePackingTime: '2025-04-07 20:45:30',
          domesticWarehouseShipmentTime: '2025-04-07 21:20:35',
          overseasWarehouseReceiptTime: '2025-04-13 15:05:15',
          overseasWarehouseOrderChangeTime: '2025-04-14 13:55:05',
          overseasWarehouseShipmentTime: '2025-04-14 13:55:05',
        },
        trackingNumber: 'RDX-BD-0020314399',
      },
    ];
  }, []);

  const expressOrders = useMemo(() => {
    // 模拟订单数据 - 与仪表盘显示数量一致
    return [
      // 商家待发货 - 2个
      {
        id: 'EX20001',
        orderTime: '2025-05-15 11:45',
        destination: 'Dhaka, Bangladesh',
        weight: '2.5kg',
        status: ORDER_STATUS.MERCHANT_PENDING_SHIPMENT,
        trackingNo: 'TRK123456',
        shippingFrom: 'pk_warehouse', // 发货地：PK仓
      },
      {
        id: 'EX20002',
        orderTime: '2025-05-15 10:30',
        destination: 'Rajshahi, Bangladesh',
        weight: '1.9kg',
        status: ORDER_STATUS.MERCHANT_PENDING_SHIPMENT,
        trackingNo: 'TRK234567',
        shippingFrom: 'bd_warehouse', // 发货地：BD仓
      },
      
      // 商家已发货 - 1个
      {
        id: 'EX20003',
        orderTime: '2025-05-14 16:30',
        destination: 'Chittagong, Bangladesh',
        weight: '1.8kg',
        status: ORDER_STATUS.MERCHANT_SHIPPED,
        trackingNo: 'TRK789012',
        shippingFrom: 'domestic', // 发货地：国内
      },
      
      // 国内仓处理中 - 1个
      {
        id: 'EX20004',
        orderTime: '2025-05-13 15:20',
        destination: 'Barisal, Bangladesh',
        weight: '2.1kg',
        status: ORDER_STATUS.DOMESTIC_WAREHOUSE_PROCESSING,
        trackingNo: 'TRK890123',
        shippingFrom: 'domestic', // 发货地：国内
      },
      
      // 干线运输中 - 3个
      {
        id: 'EX20005',
        orderTime: '2025-05-13 14:15',
        destination: 'Khulna, Bangladesh',
        weight: '2.2kg',
        status: ORDER_STATUS.MAIN_LINE_TRANSPORT,
        trackingNo: 'TRK567890',
        shippingFrom: 'pk_warehouse', // 发货地：PK仓
      },
      {
        id: 'EX20006',
        orderTime: '2025-05-13 13:40',
        destination: 'Rangpur, Bangladesh',
        weight: '2.7kg',
        status: ORDER_STATUS.MAIN_LINE_TRANSPORT,
        trackingNo: 'TRK678901',
        shippingFrom: 'bd_warehouse', // 发货地：BD仓
      },
      {
        id: 'EX20007',
        orderTime: '2025-05-13 12:55',
        destination: 'Mymensingh, Bangladesh',
        weight: '1.6kg',
        status: ORDER_STATUS.MAIN_LINE_TRANSPORT,
        trackingNo: 'TRK789012',
        shippingFrom: 'domestic', // 发货地：国内
      },
      
      // 海外仓处理中 - 1个
      {
        id: 'EX20008',
        orderTime: '2025-05-12 14:30',
        destination: 'Comilla, Bangladesh',
        weight: '2.4kg',
        status: ORDER_STATUS.OVERSEAS_WAREHOUSE_PROCESSING,
        trackingNo: 'TRK901234',
        shippingFrom: 'pk_warehouse', // 发货地：PK仓
      },
      
      // 海外仓已出库 - 3个
      {
        id: 'EX20009',
        orderTime: '2025-05-12 13:20',
        destination: 'Sylhet, Bangladesh',
        weight: '3.2kg',
        status: ORDER_STATUS.OVERSEAS_WAREHOUSE_SHIPPED,
        trackingNo: 'TRK345678',
        shippingFrom: 'bd_warehouse', // 发货地：BD仓
      },
      {
        id: 'EX20010',
        orderTime: '2025-05-12 12:45',
        destination: 'Narayanganj, Bangladesh',
        weight: '2.8kg',
        status: ORDER_STATUS.OVERSEAS_WAREHOUSE_SHIPPED,
        trackingNo: 'TRK456789',
        shippingFrom: 'domestic', // 发货地：国内
      },
      {
        id: 'EX20011',
        orderTime: '2025-05-12 11:50',
        destination: 'Gazipur, Bangladesh',
        weight: '1.7kg',
        status: ORDER_STATUS.OVERSEAS_WAREHOUSE_SHIPPED,
        trackingNo: 'TRK567890',
        shippingFrom: 'pk_warehouse', // 发货地：PK仓
      },
      // 在expressOrders数组末尾添加已取消订单示例
      // 已取消订单 - 2个
      {
        id: 'EX20012',
        orderTime: '2025-05-11 15:30',
        destination: 'Dhaka, Bangladesh',
        weight: '2.3kg',
        status: ORDER_STATUS.MERCHANT_PENDING_SHIPMENT,
        trackingNo: 'TRK678901',
        darazStatus: 'canceled',
        shippingFrom: 'bd_warehouse', // 发货地：BD仓
      },
      {
        id: 'EX20013',
        orderTime: '2025-05-11 14:45',
        destination: 'Chittagong, Bangladesh',
        weight: '1.9kg',
        status: ORDER_STATUS.MERCHANT_SHIPPED,
        trackingNo: 'TRK789012',
        darazStatus: 'canceled',
        shippingFrom: 'domestic', // 发货地：国内
      },

      // 专线订单
      {
        id: 'EX20014',
        orderTime: '2025-05-12 11:50',
        destination: 'Gazipur, Bangladesh',
        weight: '1.7kg',
        status: ORDER_STATUS.OVERSEAS_WAREHOUSE_SHIPPED,
        trackingNo: 'TRK567890',
        shippingFrom: 'pk_warehouse', // 发货地：PK仓
      },
    ];
  }, []);

  const getStatusTag = (status) => {
    const { color, text } = getOrderStatusInfo(status);
    return <Tag color={color}>{text}</Tag>;
  };
  
  // 获取Daraz订单状态标签
  const getDarazStatusTag = (status) => {
    let color = '';
    let text = status || '未知';
    
    switch(status) {
      case 'pending':
        color = 'warning';
        break;
      case 'ready_to_ship':
        color = 'primary';
        break;
      case 'shipped':
        color = 'success';
        break;
      case 'delivered':
        color = 'success';
        break;
      case 'canceled':
        color = 'danger';
        break;
      default:
        color = '';
    }
    
    return <Tag color={color}>{text}</Tag>;
  };
  
  // 显示订单状态流程
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [currentOrderStatus, setCurrentOrderStatus] = useState('');
  
  const showOrderStatusFlow = (e, status) => {
    e.stopPropagation();
    setCurrentOrderStatus(status);
    setStatusModalVisible(true);
  };
  
  const goToOrderDetail = (orderId) => {
    history.push(`/merchant/order/${orderId}`);
  };

  const handleCreateOrder = (values) => {
    console.log('创建专线订单:', values);
    setCreateModalVisible(false);
    // 这里应该有实际的创建订单逻辑
  };
  
  // 订单数据已经在上面的useMemo中定义

  // 处理多条件查询
  const handleAdvancedSearch = useCallback(() => {
    // 将输入的运单号和订单号转换为数组（按逗号、空格或换行符分割）
    const arlWaybillNoArray = arlWaybillNos.split(/[,\s\n]+/).filter(Boolean);
    const darazOrderNoArray = darazOrderNos.split(/[,\s\n]+/).filter(Boolean);
    
    // 筛选Daraz订单
    let filteredDaraz = [...darazOrders];
    
    // 按ARL运单号筛选
    if (arlWaybillNoArray.length > 0) {
      filteredDaraz = filteredDaraz.filter(order => 
        arlWaybillNoArray.some(no => order.arlWaybillNo.toLowerCase().includes(no.toLowerCase()))
      );
    }
    
    // 按Daraz订单号筛选
    if (darazOrderNoArray.length > 0) {
      filteredDaraz = filteredDaraz.filter(order => 
        darazOrderNoArray.some(no => order.darazOrderNo.toLowerCase().includes(no.toLowerCase()))
      );
    }
    
    // 按ARL运单状态筛选
    if (selectedArlStatuses.length > 0) {
      filteredDaraz = filteredDaraz.filter(order => 
        selectedArlStatuses.includes(order.arlStatus)
      );
    }
    
    // 按Daraz订单状态筛选
    if (selectedDarazStatuses.length > 0) {
      filteredDaraz = filteredDaraz.filter(order => 
        selectedDarazStatuses.includes(order.darazStatus)
      );
    }
    
    // 按取消节点筛选（仅适用于已取消订单）
    if (selectedCancelNode && activeTab === 'canceled') {
      const selectedNode = cancelNodeOptions.find(option => option.value === selectedCancelNode);
      if (selectedNode) {
        filteredDaraz = filteredDaraz.filter(order => 
          order.darazStatus === 'canceled' && selectedNode.statuses.includes(order.arlStatus)
        );
      }
    }
    
    // 按取消时间筛选（仅适用于已取消订单）
    if (selectedCancelTime && activeTab === 'canceled') {
      filteredDaraz = filteredDaraz.filter(order => {
        if (!order.cancelTime || order.darazStatus !== 'canceled') return false;
        
        switch (selectedCancelTime) {
          case 'today':
            return isToday(order.cancelTime);
          case 'yesterday':
            return isYesterday(order.cancelTime);
          case 'last_week':
            return isWithinLastWeek(order.cancelTime);
          case 'last_month':
            return isWithinLastMonth(order.cancelTime);
          case 'custom':
            if (customDateRange[0] && customDateRange[1]) {
              return isWithinDateRange(
                order.cancelTime, 
                formatDate(customDateRange[0]), 
                formatDate(customDateRange[1])
              );
            }
            return true; // 如果没有选择日期范围，则不筛选
          default:
            return true;
        }
      });
    }
    
    // 按发货地筛选
    if (selectedShippingFrom.length > 0) {
      filteredDaraz = filteredDaraz.filter(order => 
        selectedShippingFrom.includes(order.shippingFrom)
      );
    }
    
    // 按关键词筛选（搜索订单号/客户名称）
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      filteredDaraz = filteredDaraz.filter(order => 
        order.arlWaybillNo.toLowerCase().includes(keyword) ||
        order.darazOrderNo.toLowerCase().includes(keyword) ||
        (order.shopName && order.shopName.toLowerCase().includes(keyword))
      );
    }
    
    setFilteredDarazOrders(filteredDaraz);
    
    // 筛选专线订单 - 仅使用关键词
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      const filteredExpress = expressOrders.filter(order => 
        order.id.toLowerCase().includes(keyword) ||
        (order.destination && order.destination.toLowerCase().includes(keyword))
      );
      setFilteredExpressOrders(filteredExpress);
    } else {
      setFilteredExpressOrders(expressOrders);
    }
    
    // 如果有匹配的订单，自动切换到对应的标签页
     if (filteredDaraz.length > 0) {
       if (activeTab !== 'canceled' && activeTab !== 'nonCanceled') {
         setActiveTab('all');
       }
     } else if (filteredExpressOrders.length > 0) {
       setActiveTab('express');
     }
   }, [arlWaybillNos, darazOrderNos, selectedArlStatuses, selectedDarazStatuses, selectedCancelNode, selectedCancelTime, customDateRange, cancelNodeOptions, activeTab, searchKeyword, darazOrders, expressOrders, setFilteredDarazOrders, setFilteredExpressOrders, setActiveTab, filteredExpressOrders]);
  
  // 清除所有筛选条件
  const clearAllFilters = useCallback(() => {
    setArlWaybillNos('');
    setDarazOrderNos('');
    setSelectedArlStatuses([]);
    setSelectedDarazStatuses([]);
    setSelectedCancelNode('');
    setSelectedCancelTime('');
    setSelectedShippingFrom([]);
    setCustomDateRange([null, null]);
    setShowDatePicker(false);
    setSearchKeyword('');
    setFilteredDarazOrders(darazOrders);
    setFilteredExpressOrders(expressOrders);
  }, [darazOrders, expressOrders, setFilteredDarazOrders, setFilteredExpressOrders]);
  
  // 计算不同类型订单的数量
  const allDarazOrders = useMemo(() => {
    return filteredStatus || searchKeyword || arlWaybillNos || darazOrderNos || selectedArlStatuses.length > 0 || selectedDarazStatuses.length > 0 
      ? filteredDarazOrders 
      : darazOrders;
  }, [filteredStatus, searchKeyword, arlWaybillNos, darazOrderNos, selectedArlStatuses, selectedDarazStatuses, filteredDarazOrders, darazOrders]);

  const nonCanceledDarazOrders = useMemo(() => {
    return allDarazOrders.filter(order => order.darazStatus !== 'canceled');
  }, [allDarazOrders]);

  const canceledDarazOrders = useMemo(() => {
    return allDarazOrders.filter(order => order.darazStatus === 'canceled');
  }, [allDarazOrders]);
  
  // 导出Excel功能
  const exportToExcel = useCallback(() => {
    let dataToExport = [];
    let fileName = '';
    
    // 根据当前活动的标签页选择要导出的数据
    if (activeTab === 'all') {
      dataToExport = allDarazOrders.map(order => ({
        'ARL运单号': order.arlWaybillNo,
        'Daraz订单号': order.darazOrderNo,
        '店铺名称': order.shopName || '',
        '目的地国家': order.destinationCountry || '',
        '货物类型': order.cargoType || '',
        '运费(元)': order.actualFreight || '',
        '计费重量(g)': order.billingWeight || '',
        '发货地': order.shippingFrom === 'bd_warehouse' ? 'BD仓' : 
                order.shippingFrom === 'pk_warehouse' ? 'PK仓' : 
                order.shippingFrom === 'domestic' ? '国内' : '未知',
        'ARL运单状态': getOrderStatusInfo(order.arlStatus).text,
        'Daraz订单状态': order.darazStatus || '',
        '最近操作': getLatestOperation(order.operationTimes)
      }));
      fileName = '全部订单';
    } else if (activeTab === 'nonCanceled') {
      dataToExport = nonCanceledDarazOrders.map(order => ({
        'ARL运单号': order.arlWaybillNo,
        'Daraz订单号': order.darazOrderNo,
        '店铺名称': order.shopName || '',
        '目的地国家': order.destinationCountry || '',
        '货物类型': order.cargoType || '',
        '运费(元)': order.actualFreight || '',
        '计费重量(g)': order.billingWeight || '',
        '发货地': order.shippingFrom === 'bd_warehouse' ? 'BD仓' : 
                order.shippingFrom === 'pk_warehouse' ? 'PK仓' : 
                order.shippingFrom === 'domestic' ? '国内' : '未知',
        'ARL运单状态': getOrderStatusInfo(order.arlStatus).text,
        'Daraz订单状态': order.darazStatus || '',
        '最近操作': getLatestOperation(order.operationTimes)
      }));
      fileName = '非取消订单';
    } else if (activeTab === 'canceled') {
      dataToExport = canceledDarazOrders.map(order => ({
        'ARL运单号': order.arlWaybillNo,
        'Daraz订单号': order.darazOrderNo,
        '店铺名称': order.shopName || '',
        '目的地国家': order.destinationCountry || '',
        '货物类型': order.cargoType || '',
        '运费(元)': order.actualFreight || '',
        '计费重量(g)': order.billingWeight || '',
        '发货地': order.shippingFrom === 'bd_warehouse' ? 'BD仓' : 
                order.shippingFrom === 'pk_warehouse' ? 'PK仓' : 
                order.shippingFrom === 'domestic' ? '国内' : '未知',
        'ARL运单状态': getOrderStatusInfo(order.arlStatus).text,
        'Daraz订单状态': order.darazStatus || '',
        '取消时间': order.cancelTime || '',
        '最近操作': getLatestOperation(order.operationTimes)
      }));
      fileName = '已取消订单';
    } else if (activeTab === 'express') {
      dataToExport = (filteredStatus || searchKeyword ? filteredExpressOrders : expressOrders).map(order => ({
        '订单号': order.id,
        '目的地': order.destination || '',
        '重量': order.weight || '',
        '订单状态': getOrderStatusInfo(order.status).text,
        '跟踪号': order.trackingNo || '',
        '发货地': order.shippingFrom === 'bd_warehouse' ? 'BD仓' : 
                order.shippingFrom === 'pk_warehouse' ? 'PK仓' : 
                order.shippingFrom === 'domestic' ? '国内' : '未知',
        '下单时间': order.orderTime || ''
      }));
      fileName = '专线订单';
    }
    
    // 如果没有数据，提示用户
    if (dataToExport.length === 0) {
      alert('没有可导出的数据');
      return;
    }
    
    // 创建工作簿和工作表
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    
    // 设置列宽
    const colWidths = [];
    for (const key in dataToExport[0]) {
      colWidths.push({ wch: Math.max(key.length * 2, 12) });
    }
    ws['!cols'] = colWidths;
    
    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(wb, ws, fileName);
    
    // 生成文件名
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '');
    const fullFileName = `${fileName}_${dateStr}_${timeStr}.xlsx`;
    
    // 导出Excel文件
    XLSX.writeFile(wb, fullFileName);
  }, [activeTab, allDarazOrders, nonCanceledDarazOrders, canceledDarazOrders, expressOrders, filteredExpressOrders, filteredStatus, searchKeyword]);
  
  // 根据状态筛选订单
  useEffect(() => {
    if (filteredStatus) {
      // 筛选Daraz订单
      const filteredDaraz = darazOrders.filter(order => order.arlStatus === filteredStatus);
      setFilteredDarazOrders(filteredDaraz);
      
      // 筛选专线订单
      const filteredExpress = expressOrders.filter(order => order.status === filteredStatus);
      setFilteredExpressOrders(filteredExpress);
      
      // 如果有匹配的订单，自动切换到对应的标签页
      if (filteredDaraz.length > 0) {
        setActiveTab('all');
      } else if (filteredExpress.length > 0) {
        setActiveTab('express');
      }
    } else {
      // 没有筛选条件时显示所有订单
      setFilteredDarazOrders(darazOrders);
      setFilteredExpressOrders(expressOrders);
    }
  }, [filteredStatus, darazOrders, expressOrders]);
  
  
  // 当搜索条件变化时，自动执行搜索
  useEffect(() => {
    if (searchKeyword || arlWaybillNos || darazOrderNos || selectedArlStatuses.length > 0 || selectedDarazStatuses.length > 0 || selectedCancelNode || selectedCancelTime || selectedShippingFrom.length > 0 || (customDateRange[0] && customDateRange[1])) {
      handleAdvancedSearch();
    }
  }, [searchKeyword, arlWaybillNos, darazOrderNos, selectedArlStatuses, selectedDarazStatuses, selectedCancelNode, selectedCancelTime, selectedShippingFrom, customDateRange, handleAdvancedSearch]);

  /* 日期选择器和页面标题样式 */
  const customStyles = `
    .date-range-picker {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .date-range-picker .adm-picker {
      flex: 1;
      background-color: #f5f7fa;
      padding: 8px 12px;
      border-radius: 4px;
      text-align: center;
    }

    .date-range-separator {
      color: #999;
      font-size: 14px;
    }
    
    /* 页面标题样式 */
    .order-center-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      position: relative;
    }
    
    .order-center-header h2 {
      flex: 1;
      text-align: center;
      margin: 0;
      font-size: 18px;
      font-weight: 500;
    }
    
    .back-icon {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #333;
      cursor: pointer;
      border-radius: 50%;
      transition: background-color 0.3s;
    }
    
    .back-icon:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
    
    .placeholder {
      width: 32px;
    }
  `;

  // 返回上一页
  const goBack = () => {
    history.goBack();
  };

  return (
    <div className="order-center-container">
      <style>{customStyles}</style>
      <div className="order-center-header page-header">
        <div className="back-icon" onClick={goBack}>
          <svg width="20" height="20" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M27.4166 14.6673L17.4166 22.0007L27.4166 29.334" stroke="currentColor" strokeWidth="3.66667" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2>订单中心</h2>
        <div className="placeholder"></div>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.Tab title={`全部订单(${allDarazOrders.length})`} key="all">
          <div className="order-search">
            <Input
              placeholder="搜索ARL运单号/Daraz订单号"
              clearable
              value={searchKeyword}
              onChange={setSearchKeyword}
              prefix={<SearchOutline />}
            />
            <div className="search-controls">
              <div className="advanced-search-toggle" onClick={() => setAdvancedSearchVisible(!advancedSearchVisible)}>
                {advancedSearchVisible ? '收起筛选' : '高级筛选'}
                {advancedSearchVisible ? <UpOutline /> : <DownOutline />}
              </div>
              <div className="export-button" onClick={exportToExcel}>
                <DownloadOutline /> 导出
              </div>
            </div>
          </div>
          
          {advancedSearchVisible && (
            <div className="advanced-search-panel">
              <Collapse defaultActiveKey={['1']}>
                <Collapse.Panel key="1" title="多条件查询">
                  <Form layout="horizontal">
                    <Form.Item label="ARL运单号" help="支持多单号查询，用逗号或空格分隔">
                      <TextArea
                        placeholder="请输入ARL运单号，多个单号用逗号或空格分隔"
                        value={arlWaybillNos}
                        onChange={setArlWaybillNos}
                        rows={2}
                      />
                    </Form.Item>
                    
                    <Form.Item label="Daraz订单号" help="支持多单号查询，用逗号或空格分隔">
                      <TextArea
                        placeholder="请输入Daraz订单号，多个单号用逗号或空格分隔"
                        value={darazOrderNos}
                        onChange={setDarazOrderNos}
                        rows={2}
                      />
                    </Form.Item>
                    
                    <Form.Item label="ARL运单状态" help="支持多状态查询">
                      <Selector
                        options={arlStatusOptions}
                        value={selectedArlStatuses}
                        onChange={setSelectedArlStatuses}
                        multiple={true}
                      />
                    </Form.Item>
                    
                    <Form.Item label="Daraz订单状态" help="支持多状态查询">
                      <Selector
                        options={darazStatusOptions}
                        value={selectedDarazStatuses}
                        onChange={setSelectedDarazStatuses}
                        multiple={true}
                      />
                    </Form.Item>
                    
                    <Form.Item label="发货地" help="支持多选">
                      <Selector
                        options={shippingFromOptions}
                        value={selectedShippingFrom}
                        onChange={setSelectedShippingFrom}
                        multiple={true}
                      />
                    </Form.Item>
                    
                    <div className="search-actions">
                      <Button color="primary" onClick={handleAdvancedSearch}>查询</Button>
                      <Button onClick={clearAllFilters}>清空条件</Button>
                    </div>
                  </Form>
                </Collapse.Panel>
              </Collapse>
            </div>
          )}

          <List className="order-list">
            {(filteredStatus || searchKeyword || arlWaybillNos || darazOrderNos || selectedArlStatuses.length > 0 || selectedDarazStatuses.length > 0 ? filteredDarazOrders : darazOrders).map((order) => (
              <List.Item
                key={order.arlWaybillNo}
                prefix={
                  <div className="order-icon daraz-icon">D</div>
                }
                extra={<RightOutline />}
                onClick={() => goToOrderDetail(order.arlWaybillNo)}
                arrow={false}
              >
                <div className="order-item">
                  <div className="order-item-header">
                    <div className="order-id">{order.arlWaybillNo}</div>
                    <div onClick={(e) => showOrderStatusFlow(e, order.arlStatus)}>
                      {getStatusTag(order.arlStatus)}
                    </div>
                  </div>
                  <div className="order-item-info">
                    <div>{order.darazOrderNo}</div>
                    <div>{getDarazStatusTag(order.darazStatus)}</div>
                    <div>{order.cargoType}</div>
                    <OrderField 
                      label={FIELD_LABELS.actualFreight}
                      value={order.actualFreight}
                      formatter={formatMoney}
                      className="full-width-field"
                    />
                    <OrderField 
                      label={FIELD_LABELS.billingWeight}
                      value={order.billingWeight}
                      formatter={formatWeight}
                      className="full-width-field"
                    />
                    <OrderField 
                      label={FIELD_LABELS.shippingFrom}
                      value={order.shippingFrom === 'bd_warehouse' ? 'BD仓' : order.shippingFrom === 'pk_warehouse' ? 'PK仓' : order.shippingFrom === 'domestic' ? '国内' : '未知'}
                      className="full-width-field"
                    />
                    <div className="full-width-field">
                      {FIELD_LABELS.latestOperation}: {getLatestOperation(order.operationTimes)}
                    </div>
                  </div>
                </div>
              </List.Item>
            ))}
          </List>
        </Tabs.Tab>

        <Tabs.Tab title={`非取消订单(${nonCanceledDarazOrders.length})`} key="nonCanceled">
          <div className="order-search">
            <Input
              placeholder="搜索ARL运单号/Daraz订单号"
              clearable
              value={searchKeyword}
              onChange={setSearchKeyword}
              prefix={<SearchOutline />}
            />
            <div className="search-controls">
              <div className="advanced-search-toggle" onClick={() => setAdvancedSearchVisible(!advancedSearchVisible)}>
                {advancedSearchVisible ? '收起筛选' : '高级筛选'}
                {advancedSearchVisible ? <UpOutline /> : <DownOutline />}
              </div>
              <div className="export-button" onClick={exportToExcel}>
                <DownloadOutline /> 导出
              </div>
            </div>
          </div>
          
          {advancedSearchVisible && (
            <div className="advanced-search-panel">
              <Collapse defaultActiveKey={['1']}>
                <Collapse.Panel key="1" title="多条件查询">
                  <Form layout="horizontal">
                    <Form.Item label="ARL运单号" help="支持多单号查询，用逗号或空格分隔">
                      <TextArea
                        placeholder="请输入ARL运单号，多个单号用逗号或空格分隔"
                        value={arlWaybillNos}
                        onChange={setArlWaybillNos}
                        rows={2}
                      />
                    </Form.Item>
                    
                    <Form.Item label="Daraz订单号" help="支持多单号查询，用逗号或空格分隔">
                      <TextArea
                        placeholder="请输入Daraz订单号，多个单号用逗号或空格分隔"
                        value={darazOrderNos}
                        onChange={setDarazOrderNos}
                        rows={2}
                      />
                    </Form.Item>
                    
                    <Form.Item label="ARL运单状态" help="支持多状态查询">
                      <Selector
                        options={arlStatusOptions}
                        value={selectedArlStatuses}
                        onChange={setSelectedArlStatuses}
                        multiple={true}
                      />
                    </Form.Item>
                    
                    <Form.Item label="Daraz订单状态" help="支持多状态查询">
                      <Selector
                        options={darazStatusOptions}
                        value={selectedDarazStatuses}
                        onChange={setSelectedDarazStatuses}
                        multiple={true}
                      />
                    </Form.Item>
                    
                    <Form.Item label="发货地" help="支持多选">
                      <Selector
                        options={shippingFromOptions}
                        value={selectedShippingFrom}
                        onChange={setSelectedShippingFrom}
                        multiple={true}
                      />
                    </Form.Item>
                    
                    <div className="search-actions">
                      <Button color="primary" onClick={handleAdvancedSearch}>查询</Button>
                      <Button onClick={clearAllFilters}>清空条件</Button>
                    </div>
                  </Form>
                </Collapse.Panel>
              </Collapse>
            </div>
          )}

          <List className="order-list">
            {nonCanceledDarazOrders.map((order) => (
              <List.Item
                key={order.arlWaybillNo}
                prefix={
                  <div className="order-icon daraz-icon">D</div>
                }
                extra={<RightOutline />}
                onClick={() => goToOrderDetail(order.arlWaybillNo)}
                arrow={false}
              >
                <div className="order-item">
                  <div className="order-item-header">
                    <div className="order-id">{order.arlWaybillNo}</div>
                    <div onClick={(e) => showOrderStatusFlow(e, order.arlStatus)}>
                      {getStatusTag(order.arlStatus)}
                    </div>
                  </div>
                  <div className="order-item-info">
                    <div>{order.darazOrderNo}</div>
                    <div>{getDarazStatusTag(order.darazStatus)}</div>
                    <div>{order.cargoType}</div>
                    <OrderField 
                      label={FIELD_LABELS.actualFreight}
                      value={order.actualFreight}
                      formatter={formatMoney}
                      className="full-width-field"
                    />
                    <OrderField 
                      label={FIELD_LABELS.billingWeight}
                      value={order.billingWeight}
                      formatter={formatWeight}
                      className="full-width-field"
                    />
                    <OrderField 
                      label={FIELD_LABELS.shippingFrom}
                      value={order.shippingFrom === 'bd_warehouse' ? 'BD仓' : order.shippingFrom === 'pk_warehouse' ? 'PK仓' : order.shippingFrom === 'domestic' ? '国内' : '未知'}
                      className="full-width-field"
                    />
                    <div className="full-width-field">
                      {FIELD_LABELS.latestOperation}: {getLatestOperation(order.operationTimes)}
                    </div>
                  </div>
                </div>
              </List.Item>
            ))}
          </List>
        </Tabs.Tab>

        <Tabs.Tab title={`已取消订单(${canceledDarazOrders.length})`} key="canceled">
          <div className="order-search">
            <Input
              placeholder="搜索ARL运单号/Daraz订单号"
              clearable
              value={searchKeyword}
              onChange={setSearchKeyword}
              prefix={<SearchOutline />}
            />
            <div className="search-controls">
              <div className="advanced-search-toggle" onClick={() => setAdvancedSearchVisible(!advancedSearchVisible)}>
                {advancedSearchVisible ? '收起筛选' : '高级筛选'}
                {advancedSearchVisible ? <UpOutline /> : <DownOutline />}
              </div>
              <div className="export-button" onClick={exportToExcel}>
                <DownloadOutline /> 导出
              </div>
            </div>
          </div>
          
          {advancedSearchVisible && (
            <div className="advanced-search-panel">
              <Collapse defaultActiveKey={['1']}>
                <Collapse.Panel key="1" title="多条件查询">
                  <Form layout="horizontal">
                    <Form.Item label="ARL运单号" help="支持多单号查询，用逗号或空格分隔">
                      <TextArea
                        placeholder="请输入ARL运单号，多个单号用逗号或空格分隔"
                        value={arlWaybillNos}
                        onChange={setArlWaybillNos}
                        rows={2}
                      />
                    </Form.Item>
                    
                    <Form.Item label="Daraz订单号" help="支持多单号查询，用逗号或空格分隔">
                      <TextArea
                        placeholder="请输入Daraz订单号，多个单号用逗号或空格分隔"
                        value={darazOrderNos}
                        onChange={setDarazOrderNos}
                        rows={2}
                      />
                    </Form.Item>
                    
                    <Form.Item label="取消节点" help="按取消时的物流节点筛选">
                      <Selector
                        options={cancelNodeOptions}
                        value={selectedCancelNode}
                        onChange={setSelectedCancelNode}
                      />
                    </Form.Item>
                    
                    <Form.Item label="取消时间" help="按订单取消的时间筛选">
                      <Selector
                        options={cancelTimeOptions}
                        value={selectedCancelTime}
                        onChange={(value) => {
                          setSelectedCancelTime(value);
                          if (value !== 'custom') {
                            setShowDatePicker(false);
                          } else {
                            setShowDatePicker(true);
                          }
                        }}
                      />
                    </Form.Item>
                    
                    {showDatePicker && (
                      <Form.Item label="自定义时间范围">
                        <div className="date-range-picker">
                          <DatePicker
                            title="开始日期"
                            value={customDateRange[0]}
                            onChange={(val) => setCustomDateRange([val, customDateRange[1]])}
                          >
                            {(value) => value ? formatDate(value).split(' ')[0] : '选择开始日期'}
                          </DatePicker>
                          <span className="date-range-separator">至</span>
                          <DatePicker
                            title="结束日期"
                            value={customDateRange[1]}
                            onChange={(val) => setCustomDateRange([customDateRange[0], val])}
                          >
                            {(value) => value ? formatDate(value).split(' ')[0] : '选择结束日期'}
                          </DatePicker>
                        </div>
                      </Form.Item>
                    )}
                    
                    <Form.Item label="发货地" help="支持多选">
                      <Selector
                        options={shippingFromOptions}
                        value={selectedShippingFrom}
                        onChange={setSelectedShippingFrom}
                        multiple={true}
                      />
                    </Form.Item>
                    
                    <div className="search-actions">
                      <Button color="primary" onClick={handleAdvancedSearch}>查询</Button>
                      <Button onClick={clearAllFilters}>清空条件</Button>
                    </div>
                  </Form>
                </Collapse.Panel>
              </Collapse>
            </div>
          )}

          <List className="order-list">
            {canceledDarazOrders.map((order) => (
              <List.Item
                key={order.arlWaybillNo}
                prefix={
                  <div className="order-icon daraz-icon">D</div>
                }
                extra={<RightOutline />}
                onClick={() => goToOrderDetail(order.arlWaybillNo)}
                arrow={false}
              >
                <div className="order-item">
                  <div className="order-item-header">
                    <div className="order-id">{order.arlWaybillNo}</div>
                    <div onClick={(e) => showOrderStatusFlow(e, order.arlStatus)}>
                      {getStatusTag(order.arlStatus)}
                    </div>
                  </div>
                  <div className="order-item-info">
                    <div>{order.darazOrderNo}</div>
                    <div>{getDarazStatusTag(order.darazStatus)}</div>
                    <div>{order.cargoType}</div>
                    <OrderField 
                      label={FIELD_LABELS.actualFreight}
                      value={order.actualFreight}
                      formatter={formatMoney}
                      className="full-width-field"
                    />
                    <OrderField 
                      label={FIELD_LABELS.billingWeight}
                      value={order.billingWeight}
                      formatter={formatWeight}
                      className="full-width-field"
                    />
                    <OrderField 
                      label={FIELD_LABELS.shippingFrom}
                      value={order.shippingFrom === 'bd_warehouse' ? 'BD仓' : order.shippingFrom === 'pk_warehouse' ? 'PK仓' : order.shippingFrom === 'domestic' ? '国内' : '未知'}
                      className="full-width-field"
                    />
                    <div className="full-width-field">
                      {FIELD_LABELS.latestOperation}: {getLatestOperation(order.operationTimes)}
                    </div>
                  </div>
                </div>
              </List.Item>
            ))}
          </List>
        </Tabs.Tab>

        <Tabs.Tab title="专线订单" key="express">
          <div className="order-actions">
            <div className="order-search">
              <Input
                placeholder="搜索订单号/目的地"
                clearable
                value={searchKeyword}
                onChange={setSearchKeyword}
                prefix={<SearchOutline />}
              />
            </div>
            <Button
              className="create-order-btn"
              onClick={() => setCreateModalVisible(true)}
            >
              <AddOutline /> 创建订单
            </Button>
          </div>

          <List className="order-list">
            {(filteredStatus || searchKeyword ? filteredExpressOrders : expressOrders).map((order) => (
              <List.Item
                key={order.id}
                prefix={
                  <div className="order-icon express-icon">E</div>
                }
                extra={<RightOutline />}
                onClick={() => goToOrderDetail(order.id)}
                arrow={false}
              >
                <div className="order-item">
                  <div className="order-item-header">
                    <div className="order-id">{order.id}</div>
                    <div onClick={(e) => showOrderStatusFlow(e, order.status)}>
                      {getStatusTag(order.status)}
                    </div>
                  </div>
                  <div className="order-item-info">
                    <div>{order.destination}</div>
                    <OrderField 
                      value={order.weight}
                      formatter={(value) => value || '未知'}
                    />
                    <div>{order.trackingNo}</div>
                    <OrderField 
                      label={FIELD_LABELS.shippingFrom}
                      value={order.shippingFrom === 'bd_warehouse' ? 'BD仓' : order.shippingFrom === 'pk_warehouse' ? 'PK仓' : order.shippingFrom === 'domestic' ? '国内' : '未知'}
                      className="full-width-field"
                    />
                    <div className="order-time full-width-field">{order.orderTime}</div>
                  </div>
                </div>
              </List.Item>
            ))}
          </List>
        </Tabs.Tab>
      </Tabs>

      <Dialog
        visible={createModalVisible}
        title="创建专线订单"
        content={
          <Form layout="horizontal" onFinish={handleCreateOrder} ref={formRef}>
            <Form.Item
              name="destination"
              label="目的地"
              rules={[{ required: true }]}
            >
              <Input placeholder="请输入目的地" />
            </Form.Item>
            <Form.Item
              name="weight"
              label="重量(g)"
              rules={[{ required: true }]}
            >
              <Input type="number" placeholder="请输入重量" />
            </Form.Item>
            <Form.Item
              name="goodsType"
              label="货物类型"
              rules={[{ required: true }]}
            >
              <Selector
                options={[
                  { label: '普通货物', value: 'normal' },
                  { label: '易碎品', value: 'fragile' },
                  { label: '电子产品', value: 'electronics' },
                  { label: '服装', value: 'clothing' },
                ]}
              />
            </Form.Item>
            <Form.Item
              name="expectedDelivery"
              label="预计送达"
              rules={[{ required: true }]}
            >
              <DatePicker>
                {value => value ? value.toDateString() : '请选择日期'}
              </DatePicker>
            </Form.Item>
            <Form.Item
              name="remarks"
              label="备注"
            >
              <TextArea placeholder="请输入备注信息" maxLength={100} rows={2} />
            </Form.Item>
          </Form>
        }
        closeOnAction
        onClose={() => setCreateModalVisible(false)}
        actions={[
          {
            key: 'cancel',
            text: '取消',
          },
          {
            key: 'confirm',
            text: '提交',
            bold: true,
            danger: false,
            onClick: () => {
              // 表单提交逻辑在Form的onFinish中处理
              if (formRef.current) {
                formRef.current.submit();
              }
            },
          },
        ]}
      />
      
      {/* 订单状态流程对话框 */}
      <Dialog
        visible={statusModalVisible}
        title="订单状态流程"
        content={
          <div className="order-status-flow">
            <Steps
              current={getOrderStatusSteps().findIndex(
                step => step.title === getOrderStatusInfo(currentOrderStatus).text
              )}
            >
              {getOrderStatusSteps().map((step, index) => (
                <Steps.Step key={index} title={step.title} description={step.description} />
              ))}
            </Steps>
          </div>
        }
        closeOnAction
        onClose={() => setStatusModalVisible(false)}
        actions={[
          {
            key: 'close',
            text: '关闭',
          },
        ]}
      />
    </div>
  );
};

export default OrderCenter;