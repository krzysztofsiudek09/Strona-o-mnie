CREATE TABLE photos (
 id TEXT PRIMARY KEY, title TEXT NOT NULL, category TEXT NOT NULL CHECK(category IN ('portrety','podroze','chwile')),
 src TEXT NOT NULL, thumbnail TEXT NOT NULL, alt TEXT NOT NULL,
 position INTEGER NOT NULL DEFAULT 0, published INTEGER NOT NULL DEFAULT 1 CHECK(published IN (0,1))
);
CREATE TABLE social_profiles (
 platform TEXT PRIMARY KEY CHECK(platform IN ('instagram','tiktok','facebook')),
 label TEXT NOT NULL, url TEXT NOT NULL DEFAULT '', enabled INTEGER NOT NULL DEFAULT 0 CHECK(enabled IN (0,1)), position INTEGER NOT NULL DEFAULT 0
);
INSERT INTO social_profiles(platform,label,position) VALUES ('instagram','Instagram',1),('tiktok','TikTok',2),('facebook','Facebook',3);
INSERT INTO photos(id,title,category,src,thumbnail,alt,position) VALUES
 ('portret','Po prostu ja','portrety','/images/portret.webp','/images/portret-small.webp','Krzysztof w czarnej koszulce na jasnym tle',1),
 ('morze','Na końcu dnia','chwile','/images/morze.webp','/images/morze-small.webp','Sylwetka na plaży przy zachodzie słońca',2),
 ('usmiech','Małe dobre chwile','portrety','/images/usmiech.webp','/images/usmiech-small.webp','Uśmiechnięty Krzysztof w jasnej koszuli',3),
 ('gory','Trochę wyżej','podroze','/images/gory.webp','/images/gory-small.webp','Krzysztof na tle górskiej doliny',4),
 ('spokoj','Bez pośpiechu','portrety','/images/spokoj.webp','/images/spokoj-small.webp','Portret w jasnej koszuli przy kamiennej ścianie',5),
 ('zachod','Zatrzymać ten widok','chwile','/images/zachod.webp','/images/zachod-small.webp','Krzysztof przy barierce nad morzem o zachodzie słońca',6),
 ('wyjazd','Poza codziennością','podroze','/images/wyjazd.webp','/images/wyjazd-small.webp','Krzysztof podczas przejażdżki konnej',7),
 ('plaza','Jeszcze chwilę','chwile','/images/plaza.webp','/images/plaza-small.webp','Krzysztof nad brzegiem morza przy zachodzącym słońcu',8);
