import { Link, useParams, Navigate } from "react-router-dom";
import { SERVICES, SERVICE_IMG, SERVICE_POS } from "../data";
import Icon, { SERVICE_ICONS } from "../components/Icon";
import ClipText from "../components/ClipText";
import CtaButton from "../components/CtaButton";

export default function ServicePage() {
  const { slug } = useParams();
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return <Navigate to="/home" replace />;

  const others = SERVICES.filter((s) => s.slug !== slug);

  return (
    <div className="page-bg" style={{ "--bg-img": `url('/img/bg/bg-service-${service.slug}.jpg')` }}>
      <div className="page-head" style={{ "--ph-img": `url('${SERVICE_IMG[service.slug]}')`, "--ph-pos": SERVICE_POS[service.slug] }}>
        <div className="container">
          <div className="breadcrumb"><Link to="/home">Home</Link> / Services / {service.name}</div>
          <h1><ClipText key={service.slug} text={service.name} /></h1>
          <p>{service.short}</p>
        </div>
      </div>

      <section>
        <div className="container grid grid-2" style={{ alignItems: "start" }}>
          <div>
            <h2 className="section-title" style={{ fontSize: "1.5rem" }}>What's included</h2>
            <p style={{ color: "var(--muted)" }}>{service.description}</p>
            <ul className="checklist">
              {service.bullets.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </div>
          <div className="card" style={{ position: "sticky", top: 90 }}>
            <h3>Pricing</h3>
            <div className="price-line">
              SAR {service.basePrice.toLocaleString()}{service.slug === "maintenance" ? "/mo" : ""}
            </div>
            <p className="finance-line">{service.priceNote}</p>
            <CtaButton style={{ width: "100%", justifyContent: "center" }}>Book now</CtaButton>
            <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginTop: 12 }}>
              Or call <a href="tel:+966112002665">+966 11 200 2665</a>. Same-day slots most days.
            </p>
          </div>
        </div>
      </section>

      <section className="section-tint">
        <div className="container">
          <h2 className="section-title" style={{ fontSize: "1.4rem" }}>Other services</h2>
          <div className="grid grid-3" style={{ marginTop: 20 }}>
            {others.slice(0, 4).map((s) => (
              <Link key={s.slug} to={`/services/${s.slug}`} className="card hoverable">
                <span className="icon"><Icon name={SERVICE_ICONS[s.slug]} size={22} /></span>
                <h3>{s.name}</h3>
                <p>{s.short}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
