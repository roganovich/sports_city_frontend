import Link from 'next/link';
import Image from "next/image";

export default function Header() {
    return (
        <header id="header" className="header d-flex align-items-center sticky-top">
            <div className="container-fluid container-xl position-relative d-flex align-items-center">
                <a href="/" className="logo d-flex align-items-center me-auto">
                    <Image
                        src="/baner-left_1_11zon.webp"
                        className="img-fluid"
                        alt=""
                        width={100}
                        height={300}
                    />
                </a>
                <nav id="navmenu" className="navmenu">
                    <ul>
                        <li><Link href="/">Главная</Link></li>
                        <li><Link href="/fields">Площадки</Link></li>
                        <li><Link href="/teams">Команды</Link></li>
                        <li><Link href="/informations">Информация</Link></li>
                        <li><Link href="/contacts">Контакты</Link></li>
                    </ul>
                    <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
                </nav>
                <Link className="btn-getstarted" href="/login">Начать</Link>
            </div>
        </header>
    );
}
