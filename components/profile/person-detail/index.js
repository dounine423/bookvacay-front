import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import PasswordInfo from "./PasswordInfo";
import PersonalInfo from "./PersonalInfo";
import AdminSetting from "./AdminSetting";

const Index = () => {

  const { userInfo } = useSelector(state => state.auth)
  const [tabs, setTabs] = useState([])
  const [tabIndex, setTabIndex] = useState(0);
  const userTabs = [
    {
      label: "Personal Information",
      content: <PersonalInfo />,
    },
    {
      label: "Change Password",
      content: <PasswordInfo />,
    }
  ];

  const AdminTabs = [
    {
      label: "Personal Information",
      content: <PersonalInfo />,
    },
    {
      label: "Change Password",
      content: <PasswordInfo />,
    },
    // {
    //   label: "Admin Setting",
    //   content: <PasswordInfo />,
    // }
  ];

  useEffect(() => {
    let tempTabs = userTabs
    if (userInfo?.type == 1) {
      tempTabs.push({
        label: "Admin Setting",
        content: <AdminSetting />,
      })
    }
    setTabs(tempTabs)
  }, [])

  return (
    <Tabs
      className="tabs -underline-2 js-tabs"
      selectedIndex={tabIndex}
      onSelect={(index) => setTabIndex(index)}
    >
      <TabList className="tabs__controls row x-gap-40 y-gap-10 lg:x-gap-20">
        {tabs.map((tab, index) => (
          <Tab key={index} className="col-auto">
            <button className="tabs__button text-18 lg:text-16 text-light-1 fw-500 pb-5 lg:pb-0 js-tabs-button">
              {tab.label}
            </button>
          </Tab>
        ))}
      </TabList>

      <div className="tabs__content pt-30 js-tabs-content">
        {tabs.map((tab, index) => (
          <TabPanel
            key={index}
            className={`-tab-item-${index + 1} ${tabIndex === index ? "is-tab-el-active" : ""
              }`}
          >
            {tab.content}
          </TabPanel>
        ))}
      </div>
    </Tabs>

  );
};

export default Index;
