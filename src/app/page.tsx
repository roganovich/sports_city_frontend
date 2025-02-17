import Link from 'next/link';
import Image from "next/image";

export default function Home() {
  return (
      <div>
          <section id="featured-services" className="featured-services section">
              <div className="container">
                  <div className="row gy-4">
                      <div className="col-lg-6 order-2 order-lg-1 d-flex flex-column justify-content-center"
                           data-aos="fade-up">
                          <h1>Спортивный город</h1>
                          <p>Приложение позволяющее пользователям бесплатно получать доступ к спортивным площадкам города, бронировать их, организовывать тренировки или турниры. вести страницу своей команды, приглашать других пользователей.</p>
                          <div className="d-flex">
                              <Link className="btn-getstarted" href="/login">Начать</Link>
                          </div>
                      </div>
                      <div className="col-lg-6 order-1 order-lg-2 hero-img" data-aos="zoom-out" data-aos-delay="100">
                          <Image
                              src="/d799c6abe9e711ef91f67acc1207f44c.webp"
                              className="img-fluid"
                              alt=""
                              width={400}
                              height={400}
                            />
                      </div>
                  </div>
              </div>
          </section>
          <section id="featured-services" className="featured-services section">
              <div className="container">
                  <div className="row gy-4">
                      <div className="col-lg-4 d-flex" data-aos="fade-up" data-aos-delay="100">
                          <div className="service-item position-relative">
                              <div className="icon"><i className="bi bi-activity icon"></i></div>
                              <h4><a href="" className="stretched-link">Бесплатный доступ к спортивным площадкам</a></h4>
                              <p>Находите и бронируйте футбольные поля, баскетбольные площадки, теннисные корты и многое другое в несколько кликов.</p>
                          </div>
                      </div>
                      <div className="col-lg-4 d-flex" data-aos="fade-up" data-aos-delay="200">
                          <div className="service-item position-relative">
                              <div className="icon"><i className="bi bi-bounding-box-circles icon"></i></div>
                              <h4><a href="" className="stretched-link">Организация тренировок и турниров</a></h4>
                              <p>Создавайте события, приглашайте друзей или находите новых партнёров для игры. Легко управляйте расписанием и участниками.</p>
                          </div>
                      </div>
                      <div className="col-lg-4 d-flex" data-aos="fade-up" data-aos-delay="300">
                          <div className="service-item position-relative">
                              <div className="icon"><i className="bi bi-calendar4-week icon"></i></div>
                              <h4><a href="" className="stretched-link">Командная страница</a></h4>
                              <p>Создайте страницу своей команды, следите за её успехами, делитесь фото и видео, а также приглашайте новых игроков.</p>
                          </div>
                      </div>
                  </div>
              </div>
          </section>

          <section id="services" className="services section light-background">
              <div className="container section-title" data-aos="fade-up">
                  <h2>Почему выбирают нас?</h2>
              </div>
              <div className="container">
                  <div className="row gy-4">
                      <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                          <div className="service-item position-relative">
                              <p>Простота и удобство использования</p>
                          </div>
                      </div>
                      <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                          <div className="service-item position-relative">
                              <p>Бесплатный доступ к площадкам</p>
                          </div>
                      </div>
                      <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                          <div className="service-item position-relative">
                              <p>Возможность найти новых друзей и партнёров для спорта</p>
                          </div>
                      </div>
                  </div>
              </div>

          </section>

          <div className="footer-newsletter">
              <div className="container">
                  <div className="row justify-content-center text-center">
                      <div className="col-lg-6">
                          <h4>Сообщество единомышленников</h4>
                          <p>Общайтесь с другими пользователями, находите новые команды для участия или просто наслаждайтесь активным отдыхом в кругу друзей.</p>
                      </div>
                  </div>
              </div>
          </div>

      </div>
  );
}
