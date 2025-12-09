import dayjs from "dayjs";
import Image from "next/image";
import { navIcons, navLinks } from "@/constants";
import useWindowStore from "@/store/window";

const Navbar = () => {
  const { openWindow } = useWindowStore();

  return (
    <nav>
      <div>
        <Image src="/images/logo.svg" alt="navbar-bg" width={10} height={10} />
        <p className="font-bold">TJ&apos;s Portfolio</p>

        <ul>
          {navLinks.map(({ id, name, type }) => (
            <li key={id} onClick={() => openWindow(type)}>
              {name}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <ul>
          {navIcons.map(({ id, img }) => (
            <li key={id}>
              <Image
                src={img}
                alt={`icon-${id}`}
                width={20}
                height={20}
                className="icon-hover"
              />
            </li>
          ))}
        </ul>

        <time>{dayjs().format("ddd MMM D h:mm A")}</time>
      </div>
    </nav>
  );
};

export default Navbar;
