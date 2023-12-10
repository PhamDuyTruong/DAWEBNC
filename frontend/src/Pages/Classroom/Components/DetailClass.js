import React, { useState } from "react";
import { CameraIcon } from "./CameraIcon";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const DEFAULT_IMAGE =
  "https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
const DetailClass = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  return (
    <div className="flex flex-col items-center px-[60px] mb-10">
      <div className="w-full relative">
        <img src={DEFAULT_IMAGE} className="w-full h-[450px]" />
        <div className="w-[50px] h-[50px] absolute right-0 top-[420px] rounded-full p-3 flex items-center justify-center border border-[#efefef] cursor-pointer hover:bg-[#ddd] hover:opacity-50">
          <CameraIcon />
        </div>
      </div>
      <Box sx={{ width: "100%", marginTop: "40px" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="News" {...a11yProps(0)} />
            <Tab label="Exercises" {...a11yProps(1)} />
            <Tab label="People" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          News
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          Exercises
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          People
        </CustomTabPanel>
      </Box>
    </div>
  );
};

export default DetailClass;