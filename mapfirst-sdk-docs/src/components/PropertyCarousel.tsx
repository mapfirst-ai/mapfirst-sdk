import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Property } from "@mapfirst.ai/core";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

declare global {
  interface Window {
    _slideTimer?: ReturnType<typeof setTimeout>;
  }
}

interface PropertyCarouselProps {
  properties: Property[];
  selectedMarker: number | null;
  onSelectMarker: (id: number) => void;
  onFlyTo?: (lon: number, lat: number) => void;
}

export default function PropertyCarousel({
  properties,
  selectedMarker,
  onSelectMarker,
  onFlyTo,
}: PropertyCarouselProps) {
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);
  const skipNextChange = useRef(false);

  const selectedIndex = useMemo(() => {
    if (selectedMarker === null) {
      return null;
    }
    const propertyIndex = properties.findIndex(
      (p) => p.tripadvisor_id === selectedMarker
    );
    return propertyIndex === -1 ? null : propertyIndex;
  }, [properties, selectedMarker]);

  useEffect(() => {
    if (selectedIndex !== null && swiper && selectedIndex < properties.length) {
      const shouldSlide = swiper.activeIndex !== selectedIndex;
      skipNextChange.current = shouldSlide;

      if (shouldSlide) {
        swiper.slideTo(selectedIndex);
      }
    } else {
      skipNextChange.current = false;
    }
  }, [properties, selectedIndex, swiper]);

  const handleSlideChange = useCallback(
    (swiperInstance: SwiperClass) => {
      if (skipNextChange.current) {
        skipNextChange.current = false;
        return;
      }
      clearTimeout(window._slideTimer);
      window._slideTimer = setTimeout(() => {
        if (properties[swiperInstance.activeIndex]) {
          onSelectMarker(properties[swiperInstance.activeIndex].tripadvisor_id);
        }
      }, 300);
    },
    [properties, onSelectMarker]
  );

  const handleCardClick = useCallback(
    (property: Property, index: number) => {
      onSelectMarker(property.tripadvisor_id);
      if (onFlyTo && property.location) {
        onFlyTo(property.location.lon, property.location.lat);
      }
      if (swiper) {
        swiper.slideTo(index);
      }
    },
    [onSelectMarker, onFlyTo, swiper]
  );

  return (
    <div className="playground-carousel">
      <Swiper
        modules={[FreeMode, Mousewheel]}
        spaceBetween={16}
        slidesPerView="auto"
        freeMode={{
          enabled: true,
          momentum: true,
          momentumRatio: 0.5,
        }}
        mousewheel={{
          forceToAxis: true,
          sensitivity: 0.5,
        }}
        onSwiper={setSwiper}
        onSlideChange={handleSlideChange}
      >
        {properties.map((property, index) => (
          <SwiperSlide
            key={property.tripadvisor_id}
            style={{ width: "270px", height: "120px" }}
          >
            <PropertyCard
              property={property}
              isSelected={selectedMarker === property.tripadvisor_id}
              onClick={() => handleCardClick(property, index)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

// PropertyCard Component
interface PropertyCardProps {
  property: Property;
  isSelected: boolean;
  onClick: () => void;
}

function PropertyCard({ property, isSelected, onClick }: PropertyCardProps) {
  const rating = property.rating || 0;
  const reviews = property.reviews || 0;
  const displayPrice =
    property.pricing?.offer?.displayPrice ?? property.price_level;
  const url =
    property.pricing?.offer?.clickUrl ?? property.urls?.tripadvisor.main;

  // Generate star rating
  const renderStars = () => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} style={{ color: "#03852e" }}>
          ●
        </span>
      );
    }
    if (hasHalfStar) {
      stars.push(
        <span key="half" style={{ color: "#03852e" }}>
          ◐
        </span>
      );
    }
    while (stars.length < 5) {
      stars.push(
        <span key={`empty-${stars.length}`} style={{ color: "#ccc" }}>
          ○
        </span>
      );
    }

    return stars;
  };

  // Get default image based on property type
  const getDefaultImage = () => {
    const type = property.type
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/&/g, "");
    return `/img/${type}.webp`;
  };

  return (
    <div
      className={`playground-property-card ${isSelected ? "selected" : ""}`}
      onClick={onClick}
    >
      <img
        src={getDefaultImage()}
        alt={property.name}
        onError={(e) => {
          // Fallback to a placeholder if image fails
          e.currentTarget.src = "/images/placeholder.jpg";
        }}
      />
      <div className="playground-property-details">
        <div className="playground-property-name">{property.name}</div>
        <div className="playground-property-rating">
          <span className="rating-value">{rating.toFixed(1)}</span>
          <span className="stars">{renderStars()}</span>
          <span className="reviews">({reviews})</span>
        </div>
        {property.type === "Accommodation" && displayPrice && (
          <div className="playground-property-price">
            Starting at <strong>{displayPrice}</strong>
          </div>
        )}
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="playground-property-learn-more"
            onClick={(e) => e.stopPropagation()}
          >
            Learn More
          </a>
        )}
      </div>
    </div>
  );
}
