import React, { useState } from 'react';
import { Tabs, List, Input, Tag, Empty, Image, ImageViewer, Button, Checkbox, Dialog, DatePicker, Toast, Selector } from 'antd-mobile';
import { SearchOutline, RightOutline } from 'antd-mobile-icons';
import { useHistory } from 'react-router-dom';
import './index.css';
import '../../styles/common.css';

// 即将过期库存数据
const initialExpiringInventoryData = [
  {
    id: 'EXP001',
    warehouse: '孟加拉仓',
    shopSku: '527051779_BD-2539814280',
    sellerSku: 'QQFJB01-Manual-Yellow',
    itemId: 'ITM001527051779',
    productName: '【Must-have for Otakus】 Snail Manual Aircraft Cup for Men To Musturbate',
    productImage: 'https://sg-test-11.slatic.net/p/46b9fa713b1288e8f095c03ee9f6f9f0.jpg',
    inboundDate: '2024-12-01',
    daysInWarehouse: 61,
    totalStorageFee: 45.60,
    expiryDate: '2025-02-15',
    daysToExpiry: 0.5,
    quantity: 2,
    brand: 'No Brand',
    status: '冻结'
  },
  {
    id: 'EXP002',
    warehouse: '尼泊尔仓',
    shopSku: '628152880_IN-3640925391',
    sellerSku: 'TECH-PHONE-CASE-001',
    itemId: 'ITM002628152880',
    productName: 'Premium Silicone Phone Case for iPhone 14 Pro Max',
    productImage: 'https://static-01.daraz.com.bd/p/bd875e01330d145ce349d90506167972.jpg?index=0',
    inboundDate: '2024-11-15',
    daysInWarehouse: 77,
    totalStorageFee: 92.40,
    expiryDate: '2025-02-28',
    daysToExpiry: 1,
    quantity: 5,
    brand: 'TechGuard',
    status: '正常'
  },
  {
    id: 'EXP003',
    warehouse: '斯里兰卡仓',
    shopSku: '729263991_TH-4751036402',
    sellerSku: 'BEAUTY-CREAM-THAI-002',
    itemId: 'ITM003729263991',
    productName: 'Natural Coconut Oil Face Moisturizing Cream 50ml',
    productImage: 'https://via.placeholder.com/60x60?text=Product3',
    inboundDate: '2024-10-20',
    daysInWarehouse: 103,
    totalStorageFee: 123.60,
    expiryDate: '2025-03-10',
    daysToExpiry: 3,
    quantity: 3,
    brand: 'Thai Beauty',
    status: '正常'
  },
  {
    id: 'EXP004',
    warehouse: '巴基斯坦仓',
    shopSku: '830375102_PK-5862147513',
    sellerSku: 'SPORT-SHOES-RUN-003',
    itemId: 'ITM004830375102',
    productName: 'Lightweight Running Shoes for Men and Women',
    productImage: 'https://via.placeholder.com/60x60?text=Product4',
    inboundDate: '2024-11-30',
    daysInWarehouse: 62,
    totalStorageFee: 186.00,
    expiryDate: '2025-03-15',
    daysToExpiry: 43,
    quantity: 8,
    brand: 'SportMax',
    status: '正常'
  },
  {
    id: 'EXP005',
    warehouse: '巴基斯坦仓',
    shopSku: '931486213_VN-6973258624',
    sellerSku: 'ELEC-CHARGER-FAST-004',
    itemId: 'ITM005931486213',
    productName: 'Fast Charging USB-C Cable 2 Meters Length',
    productImage: 'https://via.placeholder.com/60x60?text=Product5',
    inboundDate: '2024-12-10',
    daysInWarehouse: 52,
    totalStorageFee: 31.20,
    expiryDate: '2025-02-20',
    daysToExpiry: 5,
    quantity: 4,
    brand: 'PowerLink',
    status: '正常'
  }
];

const InventoryQuery = () => {
  const history = useHistory();
  const [activeTab, setActiveTab] = useState('realtime');
  const [searchValue, setSearchValue] = useState('');
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  
  // 即将过期库存的高级功能状态
  const [expiringSearchValue, setExpiringSearchValue] = useState('');
  const [selectedExpiringItems, setSelectedExpiringItems] = useState([]);
  const [selectedStatusTags, setSelectedStatusTags] = useState([]);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [extendDialogVisible, setExtendDialogVisible] = useState(false);
  const [destroyDialogVisible, setDestroyDialogVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [expiringInventoryList, setExpiringInventoryList] = useState(initialExpiringInventoryData);
  const [isSelectMode, setIsSelectMode] = useState(false);
  
  // 状态标签选项
  const statusTagOptions = [
    { label: '24小时内过期', value: '24小时内过期' },
    { label: '3天内过期', value: '3天内过期' },
    { label: '5天内过期', value: '5天内过期' },
    { label: '申请销毁中', value: '申请销毁中' },
    { label: '实施销毁中', value: '实施销毁中' }
  ];

  // 实时库存数据
  const realtimeInventoryData = [
    {
      warehouse: '孟加拉仓',
      shopSku: '527051779_BD-2539814280',
      totalStock: 3,
      availableStock: 2,
      frozenStock: 1,
      defectiveStock: 0,
      sellerSku: 'QQFJB01-Manual-Yellow',
      productName: '【Must-have for Otakus】 Snail Manual Aircraft Cup for Men To Musturbate',
      productImage: 'https://static-01.daraz.com.bd/p/17f002f3ae1893b4699c5c3f980bb970.jpg',
      brand: 'No Brand'
    },
    {
      warehouse: '巴基斯坦仓',
      shopSku: '628152880_IN-3640925391',
      totalStock: 15,
      availableStock: 12,
      frozenStock: 2,
      defectiveStock: 1,
      sellerSku: 'TECH-PHONE-CASE-001',
      productName: 'Premium Silicone Phone Case for iPhone 14 Pro Max',
      productImage: 'https://via.placeholder.com/60x60?text=Product2',
      brand: 'TechGuard'
    },
    {
      warehouse: '斯里兰卡仓',
      shopSku: '729263991_TH-4751036402',
      totalStock: 8,
      availableStock: 6,
      frozenStock: 1,
      defectiveStock: 1,
      sellerSku: 'BEAUTY-CREAM-THAI-002',
      productName: 'Natural Coconut Oil Face Moisturizing Cream 50ml',
      productImage: 'https://via.placeholder.com/60x60?text=Product3',
      brand: 'Thai Beauty'
    },
    {
      warehouse: '中国仓',
      shopSku: '830375102_MY-5862147513',
      totalStock: 25,
      availableStock: 20,
      frozenStock: 3,
      defectiveStock: 2,
      sellerSku: 'SPORT-SHOES-RUN-003',
      productName: 'Lightweight Running Shoes for Men and Women',
      productImage: 'https://via.placeholder.com/60x60?text=Product4',
      brand: 'SportMax'
    },
    {
      warehouse: '孟加拉2仓',
      shopSku: '931486213_SG-6973258624',
      totalStock: 12,
      availableStock: 10,
      frozenStock: 2,
      defectiveStock: 0,
      sellerSku: 'ELEC-CHARGER-FAST-004',
      productName: 'Fast Charging USB-C Cable 2 Meters Length',
      productImage: 'https://via.placeholder.com/60x60?text=Product5',
      brand: 'PowerLink'
    },
    {
      warehouse: '巴基斯坦2仓',
      shopSku: '032597324_PH-7084369735',
      totalStock: 6,
      availableStock: 4,
      frozenStock: 1,
      defectiveStock: 1,
      sellerSku: 'HOME-DECOR-LAMP-005',
      productName: 'Modern LED Table Lamp with Touch Control',
      productImage: 'https://via.placeholder.com/60x60?text=Product6',
      brand: 'LightHome'
    },
    {
      warehouse: '越南仓',
      shopSku: '133608435_VN-8195470846',
      totalStock: 18,
      availableStock: 15,
      frozenStock: 2,
      defectiveStock: 1,
      sellerSku: 'CLOTH-TSHIRT-COTTON-006',
      productName: '100% Cotton Basic T-Shirt Unisex Multiple Colors',
      productImage: 'https://via.placeholder.com/60x60?text=Product7',
      brand: 'CottonWear'
    },
    {
      warehouse: '印尼仓',
      shopSku: '234719546_ID-9206581957',
      totalStock: 9,
      availableStock: 7,
      frozenStock: 1,
      defectiveStock: 1,
      sellerSku: 'KITCHEN-TOOL-KNIFE-007',
      productName: 'Professional Chef Knife Set with Wooden Block',
      productImage: 'https://via.placeholder.com/60x60?text=Product8',
      brand: 'ChefMaster'
    },
    {
      warehouse: '孟加拉仓',
      shopSku: '335820657_BD-0317692068',
      totalStock: 22,
      availableStock: 18,
      frozenStock: 3,
      defectiveStock: 1,
      sellerSku: 'BABY-TOY-SOFT-008',
      productName: 'Soft Plush Baby Toy Educational Learning Set',
      productImage: 'https://via.placeholder.com/60x60?text=Product9',
      brand: 'BabyJoy'
    },
    {
      warehouse: '印度仓',
      shopSku: '436931768_IN-1428703179',
      totalStock: 14,
      availableStock: 11,
      frozenStock: 2,
      defectiveStock: 1,
      sellerSku: 'WATCH-SMART-FITNESS-009',
      productName: 'Smart Fitness Watch with Heart Rate Monitor',
      productImage: 'https://via.placeholder.com/60x60?text=Product10',
      brand: 'FitTech'
    }
  ];



  // 库存变动流水数据（面向商家优化）
  const operationRecords = [
    {
      id: 'OP001',
      changeTime: '2025-01-30 14:30',
      productName: '苹果 iPhone 15 Pro 手机壳',
      productImage: 'https://static-01.daraz.com.bd/p/bd875e01330d145ce349d90506167972.jpg?index=0',
      changeType: '销售出库',
      changeQuantity: -3,
      stockAfterChange: 28,
      warehouse: '孟加拉仓',
      shopSku: '628152880_IN-3640925391',
      sellerSku: 'TECH-PHONE-CASE-001',
      relatedOrderNo: 'BD20250130001',
      changeReason: '客户订单发货'
    },
    {
      id: 'OP002',
      changeTime: '2025-01-30 10:15',
      productName: '快充数据线 USB-C 2米',
      productImage: 'https://via.placeholder.com/60x60?text=Product5',
      changeType: '备货入库',
      changeQuantity: 15,
      stockAfterChange: 45,
      warehouse: '巴基斯坦仓',
      shopSku: '931486213_SG-6973258624',
      sellerSku: 'ELEC-CHARGER-FAST-004',
      relatedOrderNo: 'PO20250130002',
      changeReason: '客户备货到货入库'
    },
    {
      id: 'OP003',
      changeTime: '2025-01-29 16:45',
      productName: '天然椰子油面霜 50ml',
      productImage: 'https://via.placeholder.com/60x60?text=Product3',
      changeType: '库存盘点扣减',
      changeQuantity: -2,
      stockAfterChange: 6,
      warehouse: '尼泊尔仓',
      shopSku: '729263991_TH-4751036402',
      sellerSku: 'BEAUTY-CREAM-THAI-002',
      relatedOrderNo: 'INV20250129003',
      changeReason: '盘点差异调整'
    },
    {
      id: 'OP004',
      changeTime: '2025-01-29 09:20',
      productName: '轻量化跑步鞋 男女款',
      productImage: 'https://via.placeholder.com/60x60?text=Product4',
      changeType: '补货入库',
      changeQuantity: 10,
      stockAfterChange: 35,
      warehouse: '孟加拉仓',
      shopSku: '830375102_MY-5862147513',
      sellerSku: 'SPORT-SHOES-RUN-003',
      relatedOrderNo: 'REP20250129004',
      changeReason: '库存补充'
    },
    {
      id: 'OP005',
      changeTime: '2025-01-28 13:10',
      productName: '智能健身手表 心率监测',
      productImage: 'https://via.placeholder.com/60x60?text=Product10',
      changeType: '异常调整',
      changeQuantity: -5,
      stockAfterChange: 12,
      warehouse: '孟加拉仓',
      shopSku: '436931768_IN-1428703179',
      sellerSku: 'WATCH-SMART-FITNESS-009',
      relatedOrderNo: 'ADJ20250128005',
      changeReason: '质量问题扣减'
    },
    {
      id: 'OP006',
      changeTime: '2025-01-28 08:45',
      productName: '婴儿毛绒玩具 教育套装',
      productImage: 'https://via.placeholder.com/60x60?text=Product9',
      changeType: '销售出库',
      changeQuantity: -2,
      stockAfterChange: 18,
      warehouse: '孟加拉仓',
      shopSku: '335820657_BD-0317692068',
      sellerSku: 'BABY-TOY-SOFT-008',
      relatedOrderNo: 'BD20250128006',
      changeReason: '客户订单发货'
    },
    {
      id: 'OP007',
      changeTime: '2025-01-27 15:30',
      productName: '专业厨师刀具套装',
      productImage: 'https://via.placeholder.com/60x60?text=Product8',
      changeType: '退货入库',
      changeQuantity: 1,
      stockAfterChange: 8,
      warehouse: '巴基斯坦仓',
      shopSku: '234719546_ID-9206581957',
      sellerSku: 'KITCHEN-TOOL-KNIFE-007',
      relatedOrderNo: 'RET20250127007',
      changeReason: '客户退货处理'
    },
    {
      id: 'OP008',
      changeTime: '2025-01-27 11:20',
      productName: '纯棉基础T恤 多色可选',
      productImage: 'https://via.placeholder.com/60x60?text=Product7',
      changeType: '销售出库',
      changeQuantity: -4,
      stockAfterChange: 14,
      warehouse: '尼泊尔仓',
      shopSku: '133608435_VN-8195470846',
      sellerSku: 'CLOTH-TSHIRT-COTTON-006',
      relatedOrderNo: 'VN20250127008',
      changeReason: '批量订单发货'
    }
  ];

  // 过滤逻辑
  const filteredRealtimeInventory = searchValue
    ? realtimeInventoryData.filter(
        (item) =>
          item.shopSku.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.sellerSku.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.productName.toLowerCase().includes(searchValue.toLowerCase())
      )
    : realtimeInventoryData;

  // 即将过期库存的高级过滤逻辑
  const filteredExpiringInventory = expiringInventoryList.filter((item) => {
    // 排除已销毁的商品
    if (item.status === '已销毁') {
      return false;
    }
    
    // 搜索过滤
    const searchMatch = !expiringSearchValue || 
      item.shopSku.toLowerCase().includes(expiringSearchValue.toLowerCase()) ||
      item.sellerSku.toLowerCase().includes(expiringSearchValue.toLowerCase()) ||
      item.itemId.toLowerCase().includes(expiringSearchValue.toLowerCase()) ||
      item.productName.toLowerCase().includes(expiringSearchValue.toLowerCase());
    
    // 状态标签过滤
    const statusMatch = selectedStatusTags.length === 0 || 
      selectedStatusTags.includes(getExpiryStatusTag(item.daysToExpiry).props.children) ||
      selectedStatusTags.includes(item.status);
    
    return searchMatch && statusMatch;
  });

  const filteredOperationRecords = searchValue
    ? operationRecords.filter(
        (item) =>
          item.shopSku.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.productName.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.relatedOrderNo.toLowerCase().includes(searchValue.toLowerCase())
      )
    : operationRecords;

  // 获取库存状态标签
  const getStockStatusTag = (totalStock, availableStock) => {
    if (totalStock === 0) {
      return <Tag color="#ff3141">缺货</Tag>;
    } else if (availableStock <= 5) {
      return <Tag color="#ff8f1f">低库存</Tag>;
    } else {
      return <Tag color="#00b578">正常</Tag>;
    }
  };

  // 获取过期状态标签
  const getExpiryStatusTag = (daysToExpiry, status) => {
    // 如果有特殊状态，优先显示特殊状态
    if (status && status !== '正常') {
      switch (status) {
        case '申请销毁中':
          return <Tag color="#ff8f1f">申请销毁中</Tag>;
        case '实施销毁中':
          return <Tag color="#ff3141">实施销毁中</Tag>;
        case '已销毁':
          return <Tag color="#8c8c8c">已销毁</Tag>;
        default:
          return <Tag color="#1677ff">{status}</Tag>;
      }
    }
    
    // 根据过期天数显示状态
    if (daysToExpiry <= 1) {
      return <Tag color="#ff3141">24小时内过期</Tag>;
    } else if (daysToExpiry <= 3) {
      return <Tag color="#ff8f1f">3天内过期</Tag>;
    } else {
      return <Tag color="#00b578">5天内过期</Tag>;
    }
  };

  // 获取变动类型标签
  const getChangeTypeTag = (changeType) => {
    let color = '';
    switch (changeType) {
      case '销售出库':
      case '批量订单发货':
        color = '#ff3141';
        break;
      case '采购入库':
      case '补货入库':
      case '退货入库':
        color = '#00b578';
        break;
      case '库存盘点扣减':
      case '异常调整':
        color = '#ff8f1f';
        break;
      default:
        color = '#1677ff';
    }
    return <Tag color={color}>{changeType}</Tag>;
  };

  // 格式化变动数量显示
  const formatChangeQuantity = (quantity) => {
    const sign = quantity > 0 ? '+' : '';
    return `${sign}${quantity}`;
  };

  // 处理关联单号点击
  const handleOrderClick = (orderNo, changeType) => {
    // 这里可以根据不同的变动类型跳转到不同的详情页面
    console.log(`查看${changeType}详情: ${orderNo}`);
    // 实际项目中可以跳转到订单详情、采购单详情等页面
  };

  // 处理库存变动记录点击查看Item明细
  const handleChangeRecordClick = (record) => {
    // 跳转到SKU明细页面，传递相关参数
    history.push(`/merchant/inventory-query/sku-detail/${encodeURIComponent(record.shopSku)}?sellerSku=${encodeURIComponent(record.sellerSku)}&warehouse=${encodeURIComponent(record.warehouse)}`);
  };

  // 处理图片点击
  const handleImageClick = (imageUrl) => {
    setCurrentImage(imageUrl);
    setImageViewerVisible(true);
  };

  // 处理SKU点击，跳转到明细页面
  const handleSkuClick = (shopSku) => {
    history.push(`/merchant/inventory-query/sku-detail/${encodeURIComponent(shopSku)}`);
  };
  
  // 处理即将过期库存的多选
  const handleExpiringItemSelect = (itemId, checked) => {
    if (checked) {
      setSelectedExpiringItems([...selectedExpiringItems, itemId]);
    } else {
      setSelectedExpiringItems(selectedExpiringItems.filter(id => id !== itemId));
    }
  };
  
  // 全选/取消全选
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedExpiringItems(filteredExpiringInventory.map(item => item.id));
    } else {
      setSelectedExpiringItems([]);
    }
  };
  
  // 处理延期操作
  const handleExtend = () => {
    if (selectedExpiringItems.length === 0) {
      Toast.show('请先选择要延期的商品');
      return;
    }
    setExtendDialogVisible(true);
  };
  
  // 确认延期
  const confirmExtend = () => {
    if (!selectedDate) {
      Toast.show('请选择延期日期');
      return;
    }
    
    const updatedList = expiringInventoryList.map(item => {
      if (selectedExpiringItems.includes(item.id)) {
        return {
          ...item,
          expiryDate: selectedDate.toISOString().split('T')[0],
          daysToExpiry: Math.ceil((selectedDate - new Date()) / (1000 * 60 * 60 * 24))
        };
      }
      return item;
    });
    
    setExpiringInventoryList(updatedList);
    setSelectedExpiringItems([]);
    setExtendDialogVisible(false);
    setSelectedDate(null);
    setIsSelectMode(false);
    Toast.show('延期操作成功');
  };
  
  // 处理申请销毁操作
  const handleDestroy = () => {
    if (selectedExpiringItems.length === 0) {
      Toast.show('请先选择要申请销毁的商品');
      return;
    }
    setDestroyDialogVisible(true);
  };
  
  // 确认申请销毁
  const confirmDestroy = () => {
    const updatedList = expiringInventoryList.map(item => {
      if (selectedExpiringItems.includes(item.id)) {
        return {
          ...item,
          status: '申请销毁中'
        };
      }
      return item;
    });
    
    setExpiringInventoryList(updatedList);
    setSelectedExpiringItems([]);
    setDestroyDialogVisible(false);
    setIsSelectMode(false);
    Toast.show('申请销毁操作成功');
  };
  
  // 切换选择模式
  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    setSelectedExpiringItems([]);
  };
  
  // 清除筛选条件
  const clearFilters = () => {
    setExpiringSearchValue('');
    setSelectedStatusTags([]);
    setShowAdvancedSearch(false);
  };



  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="inventory-container">
      <div className="inventory-header page-header">
        <div className="back-icon" onClick={goBack}>
          <svg width="20" height="20" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M27.4166 14.6673L17.4166 22.0007L27.4166 29.334" stroke="currentColor" strokeWidth="3.66667" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2>库存查询</h2>
        <div className="placeholder"></div>
      </div>

      <div className="inventory-search">
        <Input
          placeholder="搜索ShopSku/SellerSku"
          value={searchValue}
          onChange={setSearchValue}
          clearable
          prefix={<SearchOutline />}
        />
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.Tab title="实时库存" key="realtime">
          {filteredRealtimeInventory.length > 0 ? (
            <List className="inventory-list">
              {filteredRealtimeInventory.map((item, index) => (
                <List.Item
                  key={index}
                  extra={<RightOutline />}
                  onClick={() => handleSkuClick(item.shopSku)}
                  arrow={false}
                >
                  <div className="inventory-item">
                    <div className="inventory-item-header">
                      <div className="inventory-item-image">
                        <Image
                          src={item.productImage}
                          width={60}
                          height={60}
                          fit="cover"
                          style={{ borderRadius: '4px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageClick(item.productImage);
                          }}
                        />
                      </div>
                      <div className="inventory-item-content">
                        <div className="inventory-item-title">
                          <span className="warehouse-name">{item.warehouse}</span>
                          {getStockStatusTag(item.totalStock, item.availableStock)}
                        </div>
                        <div className="shop-sku">{item.shopSku}</div>
                        <div className="seller-sku">{item.sellerSku}</div>
                        <div className="product-name">{item.productName}</div>
                        <div className="brand">品牌: {item.brand}</div>
                        <div className="stock-info">
                          <span>总库存: {item.totalStock}</span>
                          <span>可用: {item.availableStock}</span>
                          <span>冻结: {item.frozenStock}</span>
                          <span>不良品: {item.defectiveStock}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </List.Item>
              ))}
            </List>
          ) : (
            <Empty description="暂无库存数据" />
          )}
        </Tabs.Tab>

        <Tabs.Tab title="即将过期库存" key="expiring">
          <div className="expiring-inventory-container">
            {/* 高级搜索区域 */}
            <div className="expiring-search-section">
              <div className="search-row">
                <Input
                  placeholder="搜索ShopSku/SellerSku/ItemID"
                  value={expiringSearchValue}
                  onChange={setExpiringSearchValue}
                  clearable
                  prefix={<SearchOutline />}
                  style={{ flex: 1, marginRight: '10px' }}
                />
                <Button 
                  size="small" 
                  color="primary" 
                  fill="outline"
                  onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                >
                  {showAdvancedSearch ? '收起筛选' : '高级筛选'}
                </Button>
              </div>
              
              {showAdvancedSearch && (
                <div className="advanced-search-panel">
                  <div className="filter-section">
                    <div className="filter-label">状态筛选:</div>
                    <Selector
                      options={statusTagOptions}
                      value={selectedStatusTags}
                      onChange={setSelectedStatusTags}
                      multiple
                      style={{ '--border': 'none', '--padding': '0' }}
                    />
                  </div>
                  <div className="filter-actions">
                    <Button size="small" fill="outline" onClick={clearFilters}>
                      清除筛选
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            {/* 批量操作区域 */}
            <div className="batch-operation-section">
              <div className="operation-header">
                <div className="select-controls">
                  <Button 
                    size="small" 
                    color={isSelectMode ? 'danger' : 'primary'}
                    fill="outline"
                    onClick={toggleSelectMode}
                  >
                    {isSelectMode ? '取消选择' : '批量操作'}
                  </Button>
                  {isSelectMode && (
                    <Checkbox
                      checked={selectedExpiringItems.length === filteredExpiringInventory.length && filteredExpiringInventory.length > 0}
                      indeterminate={selectedExpiringItems.length > 0 && selectedExpiringItems.length < filteredExpiringInventory.length}
                      onChange={handleSelectAll}
                      style={{ marginLeft: '10px' }}
                    >
                      全选
                    </Checkbox>
                  )}
                </div>
                {isSelectMode && selectedExpiringItems.length > 0 && (
                  <div className="batch-actions">
                    <Button size="small" color="primary" onClick={handleExtend}>
                      延期({selectedExpiringItems.length})
                    </Button>
                    <Button size="small" color="warning" onClick={handleDestroy} style={{ marginLeft: '8px' }}>
                      申请销毁({selectedExpiringItems.length})
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {/* 库存列表 */}
            {filteredExpiringInventory.length > 0 ? (
              <List className="inventory-list">
                {filteredExpiringInventory.map((item, index) => (
                  <List.Item key={item.id} arrow={false}>
                    <div className="inventory-item">
                      {isSelectMode && (
                        <div className="item-checkbox">
                          <Checkbox
                            checked={selectedExpiringItems.includes(item.id)}
                            onChange={(checked) => handleExpiringItemSelect(item.id, checked)}
                          />
                        </div>
                      )}
                      <div className="inventory-item-header">
                        <div className="inventory-item-image">
                          <Image
                            src={item.productImage}
                            width={60}
                            height={60}
                            fit="cover"
                            style={{ borderRadius: '4px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageClick(item.productImage);
                            }}
                          />
                        </div>
                        <div className="inventory-item-content">
                          <div className="inventory-item-title">
                            <span className="warehouse-name">{item.warehouse}</span>
                            {getExpiryStatusTag(item.daysToExpiry, item.status)}
                          </div>
                          <div className="shop-sku">{item.shopSku}</div>
                          <div className="seller-sku">{item.sellerSku}</div>
                          <div className="item-id">ItemID: {item.itemId}</div>
                          <div className="item-status">Item状态: {item.status}</div>
                          <div className="product-name">{item.productName}</div>
                          <div className="expiry-info">
                            <span className="inbound-date">入库时间: {item.inboundDate}</span>
                            <span className="days-count">在库天数: {item.daysInWarehouse}天</span>
                            <span className="storage-fee">总仓储费: ¥{item.totalStorageFee.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </List.Item>
                ))}
              </List>
            ) : (
              <Empty description="暂无即将过期库存" />
            )}
          </div>
        </Tabs.Tab>

        <Tabs.Tab title="库存变动流水" key="records">
          {filteredOperationRecords.length > 0 ? (
            <List className="change-records-list">
              {filteredOperationRecords.map((record) => (
                <List.Item 
                  key={record.id} 
                  arrow={false}
                  onClick={() => handleChangeRecordClick(record)}
                >
                  <div className="change-record">
                    {/* 核心信息行 */}
                    <div className="change-record-main">
                      <div className="change-time-and-type">
                        <span className="change-time">{record.changeTime}</span>
                        {getChangeTypeTag(record.changeType)}
                      </div>
                      <div className="change-quantity-highlight">
                        <span className={`quantity ${record.changeQuantity > 0 ? 'positive' : 'negative'}`}>
                          {formatChangeQuantity(record.changeQuantity)}
                        </span>
                        <span className="stock-after">剩余{record.stockAfterChange}件</span>
                      </div>
                    </div>
                    
                    {/* 商品信息区域 */}
                    <div className="product-info">
                      <div className="product-image-and-info">
                        <div className="product-image">
                          <Image
                            src={record.productImage}
                            width={50}
                            height={50}
                            fit="cover"
                            style={{ borderRadius: '4px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageClick(record.productImage);
                            }}
                          />
                        </div>
                        <div className="product-details">
                          <div className="product-name-main">{record.productName}</div>
                          <div className="sku-info">
                            <div className="shop-sku">ShopSku: {record.shopSku}</div>
                            <div className="seller-sku">SellerSku: {record.sellerSku}</div>
                          </div>
                          <div className="warehouse-info">{record.warehouse}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* 业务关联信息 */}
                    <div className="business-info">
                      <div className="related-order">
                        <span className="label">关联单号:</span>
                        <span 
                          className="order-link"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOrderClick(record.relatedOrderNo, record.changeType);
                          }}
                        >
                          {record.relatedOrderNo}
                        </span>
                      </div>
                      <div className="change-reason">
                        <span className="label">变动原因:</span>
                        <span className="reason-text">{record.changeReason}</span>
                      </div>
                    </div>
                  </div>
                </List.Item>
              ))}
            </List>
          ) : (
            <Empty description="暂无库存变动记录" />
          )}
        </Tabs.Tab>
      </Tabs>


      <ImageViewer
        image={currentImage}
        visible={imageViewerVisible}
        onClose={() => setImageViewerVisible(false)}
      />
      
      {/* 延期对话框 */}
      <Dialog
        visible={extendDialogVisible}
        title="设置延期日期"
        content={
          <div style={{ padding: '20px 0' }}>
            <div style={{ marginBottom: '15px', color: '#666' }}>
              已选择 {selectedExpiringItems.length} 个商品
            </div>
            <DatePicker
              value={selectedDate}
              onSelect={setSelectedDate}
              min={new Date()}
              precision="day"
            >
              {(value) => (
                <Button color="primary" fill="outline" style={{ width: '100%' }}>
                  {value ? value.toLocaleDateString() : '请选择延期日期'}
                </Button>
              )}
            </DatePicker>
          </div>
        }
        actions={[
          {
            key: 'cancel',
            text: '取消',
            onClick: () => {
              setExtendDialogVisible(false);
              setSelectedDate(null);
            }
          },
          {
            key: 'confirm',
            text: '确认延期',
            bold: true,
            onClick: confirmExtend
          }
        ]}
      />
      
      {/* 申请销毁对话框 */}
      <Dialog
        visible={destroyDialogVisible}
        title="确认申请销毁"
        content={
          <div style={{ padding: '20px 0' }}>
            <div style={{ marginBottom: '15px', color: '#666' }}>
              确定要申请销毁以下 {selectedExpiringItems.length} 个商品吗？
            </div>
            <div style={{ color: '#ff3141', fontSize: '14px' }}>
              注意：申请销毁后，商品状态将变更为"申请销毁中"，此操作不可撤销。
            </div>
          </div>
        }
        actions={[
          {
            key: 'cancel',
            text: '取消',
            onClick: () => setDestroyDialogVisible(false)
          },
          {
            key: 'confirm',
            text: '确认申请',
            bold: true,
            danger: true,
            onClick: confirmDestroy
          }
        ]}
      />
    </div>
  );
};

export default InventoryQuery;