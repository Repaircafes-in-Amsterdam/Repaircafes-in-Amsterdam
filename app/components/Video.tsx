export default function Video({ src, title }: { src: string; title: string }) {
  return (
    <div className="aspect-h-9 aspect-w-16">
      <iframe
        src={src}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen;"
        allowFullScreen
        className="border-0"
      ></iframe>
    </div>
  );
}
