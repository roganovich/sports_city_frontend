"use client";

import Link from 'next/link';
import Image from "next/image";
import LoginForm from "@components/LoginForm";

export default function Page() {
  return (
      <div>
        <div className="page-title">
            <div className="container d-lg-flex justify-content-between align-items-center">
                <h1 className="mb-2 mb-lg-0">Авторизация</h1>
                <nav className="breadcrumbs">
                    <ol>
                        <li><Link href="/">Главная</Link></li>
                        <li className="current">Авторизация</li>
                    </ol>
                </nav>
        </div>
    </div>
      <section id="registration" className="services section">
          <div className="container">
              <div className="row gy-4">
                  <div className="col-lg-4 order-2 order-lg-1 d-flex flex-column justify-content-center contact"
                       data-aos="fade-up">
                      <LoginForm />
                  </div>
                  <div className="col-lg-8 order-1 order-lg-2 hero-img" data-aos="zoom-out" data-aos-delay="100">
                      <Image
                          src="/registration.webp"
                          className="img-fluid"
                          alt=""
                          width={400}
                          height={400}
                      />
                  </div>
              </div>
          </div>
      </section>
    </div>
  );
}
