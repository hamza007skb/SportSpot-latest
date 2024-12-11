import React from "react";
import logo_icon from "../Assets/logo.png";
import insta_icon from "../Assets/insta.png";
import fb_icon from "../Assets/fb.png";
import twiter_icon from "../Assets/twiter.png";
import { useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/authpage" &&
        location.pathname !== "/authpage" && (
          <footer className="location" id="contact">
            <div className="com-logo">
              <div className="logo">
                <img src={logo_icon} alt="Logo" />
                <h1>Sport Spot</h1>
              </div>
              <div className="social-links">
                <a
                  href="https://www.facebook.com/profile.php?id=61551000282285"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  <img className="link-img-fb" src={fb_icon} alt="Fb-Link" />
                </a>
                <a
                  href="http://www.twitter.com/mbqtraders"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  <img
                    className="link-img-twit"
                    src={twiter_icon}
                    alt="Twiter-Link"
                  />
                </a>
                <a
                  href="https://www.instagram.com/mbqtraders?igsh=MTdtanp0eDQ0bXgzaA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  <img className="link-img-ig" src={insta_icon} alt="Insta-Link" />
                </a>
              </div>
            </div>

            <div className="off-loc" id="contact">
              <h1>Reach Us</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid, dolorum!
              </p>
              <h2>Call Us</h2>
              <p>042 5466252</p>
              <p>03219798815</p>
            </div>
          </footer>
        )}
    </>
  );
}
