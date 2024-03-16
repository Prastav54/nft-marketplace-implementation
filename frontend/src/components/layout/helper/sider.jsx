/* eslint-disable react/prop-types */
import { CalendarOutlined, HomeOutlined } from "@ant-design/icons";
import { ConfigProvider, Menu } from "antd";
import { Link } from "react-router-dom";

export const Sider = ({ closeMenu }) => {
  const items = [
    {
      label: (
        <Link to="/nft-marketplace" onClick={closeMenu}>
          Market
        </Link>
      ),
      key: "market",
      icon: <HomeOutlined />,
    },
    {
      label: (
        <Link to="/profile" onClick={closeMenu}>
          Profile
        </Link>
      ),
      key: "profile",
      icon: <CalendarOutlined />,
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 0,
        },
      }}
    >
      <Menu items={items} />
    </ConfigProvider>
  );
};
