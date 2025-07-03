import React, { useState, useEffect } from 'react';
import { List, Tag, Button } from 'antd-mobile';
import { LeftOutline } from 'antd-mobile-icons';
import { useHistory, useParams } from 'react-router-dom';
import './SkuDetail.css';

const SkuDetail = () => {
  const history = useHistory();
  const { skuId } = useParams();
  const [skuInfo, setSkuInfo] = useState(null);
  const [itemDetails, setItemDetails] = useState([]);

  // 模拟SKU基本信息
  const mockSkuInfo = {
    shopSku: skuId,
    productName: '益加益合 佳能手动飞机杯 for Men To Musturbate',
    productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
    brand: 'No Brand',
    warehouseName: '盖加拉合',
    totalStock: 3,
    availableStock: 2,
    frozenStock: 1,
    defectiveStock: 0
  };

  // 模拟Item明细数据
  const mockItemDetails = [
    {
      itemId: 'ITM001234567890',
      status: 'available',
      inboundTime: '2024-01-15 14:30:25',
      daysInWarehouse: 15,
      totalStorageFee: 12.50
    },
    {
      itemId: 'ITM001234567891',
      status: 'available',
      inboundTime: '2024-01-10 09:15:42',
      daysInWarehouse: 20,
      totalStorageFee: 16.80
    },
    {
      itemId: 'ITM001234567892',
      status: 'frozen',
      inboundTime: '2024-01-08 16:22:18',
      daysInWarehouse: 22,
      totalStorageFee: 18.70
    }
  ];

  useEffect(() => {
    // 模拟数据加载
    setSkuInfo(mockSkuInfo);
    setItemDetails(mockItemDetails);
  }, [skuId]);

  // 获取状态标签
  const getStatusTag = (status) => {
    const statusMap = {
      'available': { text: '可用', className: 'available' },
      'frozen': { text: '冻结', className: 'frozen' },
      'defective': { text: '不良品', className: 'defective' }
    };
    const config = statusMap[status] || { text: status, className: 'default' };
    return <span className={`status-tag ${config.className}`}>{config.text}</span>;
  };

  // 计算在库天数的颜色
  const getDaysColor = (days) => {
    if (days <= 7) return '#52c41a';
    if (days <= 30) return '#fa8c16';
    return '#ff4d4f';
  };

  if (!skuInfo) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="sku-detail">
      {/* 头部 */}
      <div className="sku-header">
        <Button 
          fill="none" 
          className="back-button"
          onClick={() => history.goBack()}
        >
          <LeftOutline />
        </Button>
        <div className="sku-title">SKU明细</div>
      </div>

      {/* SKU基本信息 */}
      <div className="sku-info-card">
        <div className="sku-info-content">
          <div className="product-image-container">
            <img 
              src={skuInfo.productImage} 
              alt={skuInfo.productName}
              className="product-image"
            />
          </div>
          <div className="sku-info-details">
            <div className="product-name">{skuInfo.productName}</div>
            <div className="sku-basic-info">
              <div className="info-row">
                <span className="info-label">ShopSku:</span>
                <span className="info-value">{skuInfo.shopSku}</span>
              </div>
              <div className="info-row">
                <span className="info-label">品牌:</span>
                <span className="info-value">{skuInfo.brand}</span>
              </div>
              <div className="info-row">
                <span className="info-label">仓库:</span>
                <span className="info-value">{skuInfo.warehouseName}</span>
              </div>
            </div>
            <div className="stock-summary">
              <div className="stock-item">
                <span className="stock-label">总库存:</span>
                <span className="stock-value total">{skuInfo.totalStock}</span>
              </div>
              <div className="stock-item">
                <span className="stock-label">可用:</span>
                <span className="stock-value available">{skuInfo.availableStock}</span>
              </div>
              <div className="stock-item">
                <span className="stock-label">冻结:</span>
                <span className="stock-value frozen">{skuInfo.frozenStock}</span>
              </div>
              <div className="stock-item">
                <span className="stock-label">不良品:</span>
                <span className="stock-value defective">{skuInfo.defectiveStock}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Item明细列表 */}
      <div className="item-details-card">
        <div className="card-title">Item明细 ({itemDetails.length})</div>
        <List className="item-details-list">
          {itemDetails.map((item, index) => (
            <List.Item key={item.itemId} className="item-detail-item">
              <div className="item-detail-content">
                <div className="item-header">
                  <div className="item-id">{item.itemId}</div>
                  {getStatusTag(item.status)}
                </div>
                <div className="item-info">
                  <div className="item-info-row">
                    <div className="info-item">
                      <span className="item-label">入库时间:</span>
                      <span className="item-value">{item.inboundTime}</span>
                    </div>
                  </div>
                  <div className="item-info-row">
                    <div className="info-item">
                      <span className="item-label">在库天数:</span>
                      <span 
                        className="item-value days"
                        style={{ color: getDaysColor(item.daysInWarehouse) }}
                      >
                        {item.daysInWarehouse}天
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="item-label">总仓储费:</span>
                      <span className="item-value fee">¥{item.totalStorageFee.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </List.Item>
          ))}
        </List>
      </div>
    </div>
  );
};

export default SkuDetail;