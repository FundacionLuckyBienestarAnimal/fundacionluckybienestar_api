-- ===========================================================
-- FUNDACIÓN LUCKY BIENESTAR ANIMAL - ESQUEMA DB V1.1
-- Corrección: badges desacoplados de profiles
-- PostgreSQL / Supabase
-- PWA pública + Backoffice CRM
-- ===========================================================
-- Basado en el esquema inicial compartido por el equipo y extendido
-- para: Auth Supabase, perfiles, roles/permisos, CRM Landing,
-- publicaciones, animales, adopciones, voluntariado, notificaciones,
-- contacto, FAQ, impacto y multimedia.
-- ===========================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===========================================================
-- 0. FUNCIONES GENERALES
-- ===========================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- ===========================================================
-- 1. IDENTIDAD, AVATARES, ROLES, PERMISOS Y BADGES
-- ===========================================================

CREATE TABLE IF NOT EXISTS public.avatar_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    image_url TEXT NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_avatar_options_default
ON public.avatar_options(is_default)
WHERE is_default = TRUE AND deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY,
    avatar_id UUID REFERENCES public.avatar_options(id),

    first_names VARCHAR(150),
    last_names VARCHAR(150),
    phone VARCHAR(50),
    birth_date DATE,
    address TEXT,
    housing_sector VARCHAR(200),

    status VARCHAR(50) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'inactive', 'blocked')),
    user_type VARCHAR(50) NOT NULL DEFAULT 'public'
        CHECK (user_type IN ('public', 'staff')),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,

    CONSTRAINT fk_profile_auth
        FOREIGN KEY (id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.roles (
    key VARCHAR(100) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    is_internal BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.permissions (
    key VARCHAR(150) PRIMARY KEY,
    module VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
    role_key VARCHAR(100) NOT NULL REFERENCES public.roles(key) ON DELETE CASCADE,
    permission_key VARCHAR(150) NOT NULL REFERENCES public.permissions(key) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_key, permission_key)
);

CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role_key VARCHAR(100) NOT NULL REFERENCES public.roles(key) ON DELETE RESTRICT,
    assigned_by UUID REFERENCES public.profiles(id),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, role_key)
);

CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    icon VARCHAR(150),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE RESTRICT,
    source_module VARCHAR(100),
    source_id UUID,
    awarded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    awarded_by UUID REFERENCES public.profiles(id),
    UNIQUE (user_id, badge_id, source_module, source_id)
);

-- ===========================================================
-- 2. MULTIMEDIA
-- ===========================================================

CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    bucket VARCHAR(100) NOT NULL,
    path TEXT NOT NULL,
    public_url TEXT,
    alt_text TEXT,
    media_type VARCHAR(50) NOT NULL DEFAULT 'image'
        CHECK (media_type IN ('image', 'video', 'document', 'other')),
    uploaded_by UUID REFERENCES public.profiles(id),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,

    UNIQUE (bucket, path)
);

-- ===========================================================
-- 3. CRM LANDING PAGE
-- ===========================================================

CREATE TABLE IF NOT EXISTS public.landing_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    key VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(250),
    highlighted_text VARCHAR(250),
    subtitle TEXT,
    main_media_id UUID REFERENCES public.media_assets(id),

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    order_index INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.hero_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    section_id UUID NOT NULL REFERENCES public.landing_sections(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    icon VARCHAR(150),
    cta_label VARCHAR(150),
    cta_href TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    order_index INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.landing_impact_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    section_id UUID NOT NULL REFERENCES public.landing_sections(id) ON DELETE CASCADE,
    prefix_text VARCHAR(150),
    metric_value INTEGER NOT NULL DEFAULT 0,
    suffix_text VARCHAR(150),
    description TEXT,
    icon VARCHAR(150),
    cta_label VARCHAR(150),
    cta_href TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    order_index INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.landing_info_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    section_id UUID NOT NULL REFERENCES public.landing_sections(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    icon VARCHAR(150),
    cta_label VARCHAR(150),
    cta_href TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    order_index INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

-- ===========================================================
-- 4. PUBLICACIONES, CAMPAÑAS Y EVENTOS
-- ===========================================================

CREATE TABLE IF NOT EXISTS public.publication_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(150) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    order_index INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.publications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    category_id UUID REFERENCES public.publication_categories(id),
    cover_media_id UUID REFERENCES public.media_assets(id),
    created_by UUID REFERENCES public.profiles(id),

    title VARCHAR(250) NOT NULL,
    slug VARCHAR(250) NOT NULL UNIQUE,

    subtitle TEXT,
    description TEXT,
    content TEXT,

    type VARCHAR(50) NOT NULL DEFAULT 'post'
        CHECK (type IN ('post', 'campaign', 'event', 'news', 'about')),
    status VARCHAR(50) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),

    featured_section VARCHAR(100),
    event_date DATE,
    date_label VARCHAR(150),
    cta_label VARCHAR(150),

    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    order_index INTEGER NOT NULL DEFAULT 0,
    published_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

-- ===========================================================
-- 5. ANIMALES, ADOPCIONES Y CATÁLOGO
-- ===========================================================

CREATE TABLE IF NOT EXISTS public.animal_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    created_by UUID REFERENCES public.profiles(id),

    name VARCHAR(200) NOT NULL,
    slug VARCHAR(250) NOT NULL UNIQUE,

    species VARCHAR(30) NOT NULL
        CHECK (species IN ('dog', 'cat', 'other')),
    sex VARCHAR(30) NOT NULL DEFAULT 'unknown'
        CHECK (sex IN ('male', 'female', 'unknown')),
    size VARCHAR(30) NOT NULL DEFAULT 'medium'
        CHECK (size IN ('small', 'medium', 'large')),
    age_label VARCHAR(100),

    status VARCHAR(50) NOT NULL DEFAULT 'hidden'
        CHECK (status IN ('available', 'in_process', 'sponsored', 'adopted', 'hidden')),

    is_sterilized BOOLEAN NOT NULL DEFAULT TRUE,
    description TEXT,

    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    order_index INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.animal_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    animal_id UUID NOT NULL REFERENCES public.animal_profiles(id) ON DELETE CASCADE,
    media_id UUID NOT NULL REFERENCES public.media_assets(id),

    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    order_index INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,

    UNIQUE (animal_id, media_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_animal_one_primary_image
ON public.animal_images(animal_id)
WHERE is_primary = TRUE AND deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS public.animal_characteristics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    animal_id UUID NOT NULL REFERENCES public.animal_profiles(id) ON DELETE CASCADE,
    label VARCHAR(200) NOT NULL,

    order_index INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

-- ===========================================================
-- 6. TIPOS DE VIVIENDA Y SOLICITUDES DE ADOPCIÓN
-- ===========================================================

CREATE TABLE IF NOT EXISTS public.housing_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    key VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    requires_other_detail BOOLEAN NOT NULL DEFAULT FALSE,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    order_index INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.adoption_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    animal_id UUID NOT NULL REFERENCES public.animal_profiles(id) ON DELETE RESTRICT,
    housing_type_id UUID NOT NULL REFERENCES public.housing_types(id),

    housing_other_detail TEXT,
    adoption_reason TEXT NOT NULL,

    status VARCHAR(50) NOT NULL DEFAULT 'submitted'
        CHECK (status IN ('submitted', 'under_review', 'in_process', 'completed', 'rejected', 'cancelled')),

    reviewed_by UUID REFERENCES public.profiles(id),
    review_message TEXT,

    submitted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMPTZ,
    process_started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_adoption_one_active_per_user_animal
ON public.adoption_applications(user_id, animal_id)
WHERE status IN ('submitted', 'under_review', 'in_process')
  AND deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS public.adoption_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    application_id UUID NOT NULL REFERENCES public.adoption_applications(id) ON DELETE CASCADE,
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    message TEXT,
    changed_by UUID REFERENCES public.profiles(id),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================================
-- 7. VOLUNTARIADO
-- ===========================================================

CREATE TABLE IF NOT EXISTS public.volunteer_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    title VARCHAR(200) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL DEFAULT 'other'
        CHECK (type IN ('material', 'schedule', 'condition', 'other')),
    is_required BOOLEAN NOT NULL DEFAULT TRUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    order_index INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.volunteer_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

    motivation TEXT NOT NULL,
    availability_type VARCHAR(50) NOT NULL
        CHECK (availability_type IN ('weekdays', 'weekends', 'both')),

    status VARCHAR(50) NOT NULL DEFAULT 'submitted'
        CHECK (status IN ('submitted', 'under_review', 'approved', 'rejected', 'cancelled')),

    is_adult_confirmed BOOLEAN NOT NULL DEFAULT FALSE,

    reviewed_by UUID REFERENCES public.profiles(id),
    review_message TEXT,

    submitted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_volunteer_one_active_application
ON public.volunteer_applications(user_id)
WHERE status IN ('submitted', 'under_review')
  AND deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS public.volunteer_application_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    application_id UUID NOT NULL REFERENCES public.volunteer_applications(id) ON DELETE CASCADE,
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    message TEXT,
    changed_by UUID REFERENCES public.profiles(id),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.volunteer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    approved_application_id UUID NOT NULL REFERENCES public.volunteer_applications(id) ON DELETE RESTRICT,

    status VARCHAR(50) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'inactive', 'suspended')),
    approved_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    approved_by UUID REFERENCES public.profiles(id),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,

    UNIQUE (user_id)
);

-- ===========================================================
-- 8. TÉRMINOS, NOTIFICACIONES Y COMUNICACIONES
-- ===========================================================

CREATE TABLE IF NOT EXISTS public.terms_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) NOT NULL
        CHECK (type IN ('general', 'adoption', 'volunteer')),
    version INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    published_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_terms_active_type_version
ON public.terms_documents(type, version)
WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS public.terms_acceptances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    terms_id UUID NOT NULL REFERENCES public.terms_documents(id) ON DELETE RESTRICT,

    adoption_application_id UUID REFERENCES public.adoption_applications(id) ON DELETE CASCADE,
    volunteer_application_id UUID REFERENCES public.volunteer_applications(id) ON DELETE CASCADE,

    accepted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_terms_one_context CHECK (
        ((adoption_application_id IS NOT NULL)::int +
         (volunteer_application_id IS NOT NULL)::int) = 1
    )
);

CREATE TABLE IF NOT EXISTS public.user_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'info'
        CHECK (type IN ('info', 'success', 'warning', 'error')),
    related_module VARCHAR(100),
    related_id UUID,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.communication_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    adoption_application_id UUID REFERENCES public.adoption_applications(id) ON DELETE SET NULL,
    volunteer_application_id UUID REFERENCES public.volunteer_applications(id) ON DELETE SET NULL,

    channel VARCHAR(50) NOT NULL
        CHECK (channel IN ('in_app', 'email', 'whatsapp')),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'manual'
        CHECK (status IN ('pending', 'sent', 'failed', 'manual')),
    sent_by UUID REFERENCES public.profiles(id),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================================
-- 9. CONTACTO, REDES Y FAQ
-- ===========================================================

CREATE TABLE IF NOT EXISTS public.contact_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    whatsapp_number VARCHAR(50),
    phone_label VARCHAR(150),
    email VARCHAR(255),
    address TEXT,
    map_embed_url TEXT,
    google_maps_url TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,

    CONSTRAINT chk_contact_info_email
        CHECK (
            email IS NULL
            OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
        )
);

CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    platform VARCHAR(100) NOT NULL,
    label VARCHAR(150),
    url TEXT NOT NULL,
    icon VARCHAR(150),

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    order_index INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.faq_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    question VARCHAR(500) NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'general',

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    order_index INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

-- ===========================================================
-- 10. ÍNDICES
-- ===========================================================

CREATE INDEX IF NOT EXISTS idx_profiles_avatar ON public.profiles(avatar_id);
CREATE INDEX IF NOT EXISTS idx_profiles_status_user_type ON public.profiles(status, user_type);

CREATE INDEX IF NOT EXISTS idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role_key);

CREATE INDEX IF NOT EXISTS idx_media_uploaded_by ON public.media_assets(uploaded_by);

CREATE INDEX IF NOT EXISTS idx_landing_sections_key ON public.landing_sections(key);
CREATE INDEX IF NOT EXISTS idx_hero_section ON public.hero_cards(section_id);
CREATE INDEX IF NOT EXISTS idx_impact_section ON public.landing_impact_blocks(section_id);
CREATE INDEX IF NOT EXISTS idx_info_cards_section ON public.landing_info_cards(section_id);

CREATE INDEX IF NOT EXISTS idx_publication_category ON public.publications(category_id);
CREATE INDEX IF NOT EXISTS idx_publication_created_by ON public.publications(created_by);
CREATE INDEX IF NOT EXISTS idx_publication_cover ON public.publications(cover_media_id);
CREATE INDEX IF NOT EXISTS idx_publication_public_lookup ON public.publications(status, is_active, is_featured, featured_section);

CREATE INDEX IF NOT EXISTS idx_animal_profile_created ON public.animal_profiles(created_by);
CREATE INDEX IF NOT EXISTS idx_animal_public_lookup ON public.animal_profiles(status, is_active, is_featured);
CREATE INDEX IF NOT EXISTS idx_animal_image_animal ON public.animal_images(animal_id);
CREATE INDEX IF NOT EXISTS idx_animal_image_media ON public.animal_images(media_id);
CREATE INDEX IF NOT EXISTS idx_animal_characteristic_animal ON public.animal_characteristics(animal_id);

CREATE INDEX IF NOT EXISTS idx_adoption_user ON public.adoption_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_adoption_animal ON public.adoption_applications(animal_id);
CREATE INDEX IF NOT EXISTS idx_adoption_status ON public.adoption_applications(status);

CREATE INDEX IF NOT EXISTS idx_volunteer_user ON public.volunteer_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_status ON public.volunteer_applications(status);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.user_notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_communication_user ON public.communication_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_faq_category ON public.faq_items(category);

-- ===========================================================
-- 11. TRIGGERS updated_at
-- ===========================================================

DO $$
DECLARE
    t TEXT;
BEGIN
    FOREACH t IN ARRAY ARRAY[
        'avatar_options',
        'profiles',
        'badges',
        'media_assets',
        'landing_sections',
        'hero_cards',
        'landing_impact_blocks',
        'landing_info_cards',
        'publication_categories',
        'publications',
        'animal_profiles',
        'animal_images',
        'animal_characteristics',
        'housing_types',
        'adoption_applications',
        'volunteer_requirements',
        'volunteer_applications',
        'volunteer_profiles',
        'terms_documents',
        'contact_info',
        'social_links',
        'faq_items'
    ]
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS trg_%I_updated_at ON public.%I', t, t);
        EXECUTE format(
            'CREATE TRIGGER trg_%I_updated_at
             BEFORE UPDATE ON public.%I
             FOR EACH ROW
             EXECUTE FUNCTION public.update_updated_at_column()',
             t, t
        );
    END LOOP;
END $$;

-- ===========================================================
-- 12. REGLAS DE LÍMITE: ANIMALES
-- ===========================================================

CREATE OR REPLACE FUNCTION public.enforce_animal_images_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    active_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO active_count
    FROM public.animal_images
    WHERE animal_id = NEW.animal_id
      AND deleted_at IS NULL
      AND (TG_OP = 'INSERT' OR id <> NEW.id);

    IF active_count >= 3 THEN
        RAISE EXCEPTION 'Un animal puede tener máximo 3 imágenes.';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_animal_images_limit ON public.animal_images;
CREATE TRIGGER trg_enforce_animal_images_limit
BEFORE INSERT OR UPDATE ON public.animal_images
FOR EACH ROW
EXECUTE FUNCTION public.enforce_animal_images_limit();

CREATE OR REPLACE FUNCTION public.enforce_animal_characteristics_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    active_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO active_count
    FROM public.animal_characteristics
    WHERE animal_id = NEW.animal_id
      AND deleted_at IS NULL
      AND is_active = TRUE
      AND (TG_OP = 'INSERT' OR id <> NEW.id);

    IF NEW.is_active = TRUE AND active_count >= 5 THEN
        RAISE EXCEPTION 'Un animal puede tener máximo 5 características activas.';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_animal_characteristics_limit ON public.animal_characteristics;
CREATE TRIGGER trg_enforce_animal_characteristics_limit
BEFORE INSERT OR UPDATE ON public.animal_characteristics
FOR EACH ROW
EXECUTE FUNCTION public.enforce_animal_characteristics_limit();

-- ===========================================================
-- 13. SEEDS BASE
-- ===========================================================

INSERT INTO public.avatar_options (key, name, image_url, is_default, is_active, order_index)
VALUES
    ('lucky_default', 'Lucky Default', '/avatars/lucky-default.png', TRUE, TRUE, 0),
    ('lucky_01', 'Lucky 01', '/avatars/lucky-01.png', FALSE, TRUE, 1),
    ('lucky_02', 'Lucky 02', '/avatars/lucky-02.png', FALSE, TRUE, 2),
    ('lucky_03', 'Lucky 03', '/avatars/lucky-03.png', FALSE, TRUE, 3),
    ('lucky_04', 'Lucky 04', '/avatars/lucky-04.png', FALSE, TRUE, 4),
    ('lucky_05', 'Lucky 05', '/avatars/lucky-05.png', FALSE, TRUE, 5),
    ('lucky_06', 'Lucky 06', '/avatars/lucky-06.png', FALSE, TRUE, 6),
    ('lucky_07', 'Lucky 07', '/avatars/lucky-07.png', FALSE, TRUE, 7),
    ('lucky_08', 'Lucky 08', '/avatars/lucky-08.png', FALSE, TRUE, 8),
    ('lucky_09', 'Lucky 09', '/avatars/lucky-09.png', FALSE, TRUE, 9)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.roles (key, name, description, is_internal)
VALUES
    ('admin', 'Administrador', 'Control total del CRM y configuración del sistema.', TRUE),
    ('operator', 'Operador', 'Gestión operativa de landing, adopciones, voluntariado y campañas.', TRUE),
    ('public_user', 'Usuario normal', 'Usuario registrado desde la landing pública.', FALSE)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.permissions (key, module, description)
VALUES
    ('backoffice.access', 'auth', 'Permite acceder al Backoffice.'),
    ('users.read', 'users', 'Permite ver usuarios.'),
    ('users.manage', 'users', 'Permite gestionar usuarios, roles y estados.'),
    ('content.manage', 'content', 'Permite gestionar landing, publicaciones, campañas y multimedia.'),
    ('animals.manage', 'animals', 'Permite gestionar animales y catálogo de adopción.'),
    ('adoptions.manage', 'adoptions', 'Permite revisar y gestionar solicitudes de adopción.'),
    ('volunteers.manage', 'volunteers', 'Permite revisar y gestionar solicitudes de voluntariado.'),
    ('settings.manage', 'settings', 'Permite gestionar contacto, FAQ, términos y catálogos.'),
    ('communications.manage', 'communications', 'Permite enviar o registrar comunicaciones.'),
    ('profile.read_own', 'profile', 'Permite leer el perfil propio.'),
    ('profile.update_own', 'profile', 'Permite actualizar el perfil propio.'),
    ('adoption.apply', 'adoptions', 'Permite enviar solicitud de adopción.'),
    ('volunteer.apply', 'volunteers', 'Permite enviar solicitud de voluntariado.')
ON CONFLICT (key) DO NOTHING;

-- Admin: todos los permisos
INSERT INTO public.role_permissions (role_key, permission_key)
SELECT 'admin', key FROM public.permissions
ON CONFLICT DO NOTHING;

-- Operador
INSERT INTO public.role_permissions (role_key, permission_key)
VALUES
    ('operator', 'backoffice.access'),
    ('operator', 'users.read'),
    ('operator', 'content.manage'),
    ('operator', 'animals.manage'),
    ('operator', 'adoptions.manage'),
    ('operator', 'volunteers.manage'),
    ('operator', 'settings.manage'),
    ('operator', 'communications.manage'),
    ('operator', 'profile.read_own'),
    ('operator', 'profile.update_own')
ON CONFLICT DO NOTHING;

-- Ayudante
INSERT INTO public.role_permissions (role_key, permission_key)
VALUES
    ('foundation_helper', 'backoffice.access'),
    ('foundation_helper', 'content.manage'),
    ('foundation_helper', 'animals.manage'),
    ('foundation_helper', 'profile.read_own'),
    ('foundation_helper', 'profile.update_own')
ON CONFLICT DO NOTHING;

-- Usuario normal
INSERT INTO public.role_permissions (role_key, permission_key)
VALUES
    ('public_user', 'profile.read_own'),
    ('public_user', 'profile.update_own'),
    ('public_user', 'adoption.apply'),
    ('public_user', 'volunteer.apply')
ON CONFLICT DO NOTHING;

INSERT INTO public.badges (key, name, description, icon, is_active, order_index)
VALUES
    ('volunteer', 'Voluntario Lucky', 'Usuario aprobado como voluntario de Fundación Lucky.', 'HandHeart', TRUE, 1),
    ('adopter', 'Adoptante Lucky', 'Usuario que culminó un proceso de adopción.', 'HomeHeart', TRUE, 2),
    ('sponsor', 'Apadrinador Lucky', 'Usuario que apadrina a un animalito. Preparado para V2.', 'HeartHandshake', TRUE, 3)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.publication_categories (name, slug, description, is_active, order_index)
VALUES
    ('Adopciones', 'adopciones', 'Ferias, jornadas y publicaciones relacionadas con adopciones.', TRUE, 1),
    ('Donaciones', 'donaciones', 'Campañas de alimento, fondos o insumos.', TRUE, 2),
    ('Salud', 'salud', 'Jornadas veterinarias, vacunas y esterilización.', TRUE, 3),
    ('Eventos', 'eventos', 'Eventos y actividades de la fundación.', TRUE, 4),
    ('Fundación', 'fundacion', 'Entradas sobre la historia y comunidad Lucky.', TRUE, 5)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.housing_types (key, name, description, requires_other_detail, is_active, order_index)
VALUES
    ('single_family_house', 'Casa unifamiliar', 'Casa independiente o familiar.', FALSE, TRUE, 1),
    ('apartment', 'Departamento o piso', 'Departamento dentro de edificio o conjunto.', FALSE, TRUE, 2),
    ('suite', 'Suite / Mini-departamento', 'Suite, mini-departamento o espacio reducido.', FALSE, TRUE, 3),
    ('farm', 'Finca / Hacienda', 'Espacio rural, finca o hacienda.', FALSE, TRUE, 4),
    ('room', 'Habitación', 'Habitación o cuarto dentro de una vivienda.', FALSE, TRUE, 5),
    ('other', 'Otro', 'Otro tipo de vivienda no listado.', TRUE, TRUE, 6)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.volunteer_requirements (title, description, type, is_required, is_active, order_index)
VALUES
    ('Pala, escoba o trapeador', 'El voluntario deberá llevar uno de estos implementos. Los materiales se quedarán en el refugio.', 'material', TRUE, TRUE, 1),
    ('Desinfectante o cloro', 'Insumo requerido para apoyar la limpieza del refugio. El material se quedará en el refugio.', 'material', TRUE, TRUE, 2),
    ('Disponibilidad de 8:45 a 11:00', 'La fundación podrá coordinar asistencia dentro de este rango horario.', 'schedule', TRUE, TRUE, 3),
    ('Asistencia en días predispuestos por la fundación', 'El voluntariado se coordina según la planificación de la fundación.', 'condition', TRUE, TRUE, 4)
ON CONFLICT DO NOTHING;

INSERT INTO public.terms_documents (title, content, type, version, is_active, published_at)
VALUES
    ('Términos de adopción', 'Contenido pendiente de completar desde Backoffice.', 'adoption', 1, TRUE, CURRENT_TIMESTAMP),
    ('Términos de voluntariado', 'Contenido pendiente de completar desde Backoffice.', 'volunteer', 1, TRUE, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

INSERT INTO public.landing_sections (key, title, highlighted_text, subtitle, is_active, order_index)
VALUES
    ('hero', 'Cada animal merece un hogar lleno de amor', 'hogar lleno de amor', 'Rescatamos, cuidamos y protegemos a animales en situación de abandono.', TRUE, 1),
    ('impact', 'Refugiados Lucky', '900', 'Cada visita, donación y adopción nos ayuda a seguir cuidando vidas.', TRUE, 4),
    ('faq', 'Preguntas Frecuentes', NULL, 'Resolvemos tus principales dudas sobre cómo funcionamos y cómo puedes involucrarte.', TRUE, 10),
    ('contact', 'Estamos para escucharte', NULL, 'Contáctanos por nuestros canales oficiales.', TRUE, 9)
ON CONFLICT (key) DO NOTHING;

-- ===========================================================
-- 14. FUNCIONES AUTH / PERMISOS
-- ===========================================================

CREATE OR REPLACE FUNCTION public.default_avatar_id()
RETURNS UUID
LANGUAGE sql
STABLE
AS $$
    SELECT id
    FROM public.avatar_options
    WHERE is_default = TRUE
      AND is_active = TRUE
      AND deleted_at IS NULL
    LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.has_role(required_role TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles ur
        JOIN public.profiles p ON p.id = ur.user_id
        WHERE ur.user_id = auth.uid()
          AND ur.role_key = required_role
          AND ur.is_active = TRUE
          AND p.status = 'active'
          AND p.deleted_at IS NULL
    );
$$;

CREATE OR REPLACE FUNCTION public.has_permission(required_permission TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles ur
        JOIN public.role_permissions rp ON rp.role_key = ur.role_key
        JOIN public.profiles p ON p.id = ur.user_id
        WHERE ur.user_id = auth.uid()
          AND ur.is_active = TRUE
          AND p.status = 'active'
          AND p.deleted_at IS NULL
          AND rp.permission_key = required_permission
    );
$$;

CREATE OR REPLACE FUNCTION public.my_permissions()
RETURNS TABLE(permission_key TEXT)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT DISTINCT rp.permission_key
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON rp.role_key = ur.role_key
    JOIN public.profiles p ON p.id = ur.user_id
    WHERE ur.user_id = auth.uid()
      AND ur.is_active = TRUE
      AND p.status = 'active'
      AND p.deleted_at IS NULL;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_avatar_id UUID;
BEGIN
    SELECT public.default_avatar_id() INTO v_avatar_id;

    INSERT INTO public.profiles (
        id,
        avatar_id,
        first_names,
        last_names,
        phone,
        birth_date,
        address,
        housing_sector,
        status,
        user_type
    )
    VALUES (
        NEW.id,
        v_avatar_id,
        COALESCE(NEW.raw_user_meta_data->>'first_names', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_names', ''),
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        NULLIF(NEW.raw_user_meta_data->>'birth_date', '')::DATE,
        COALESCE(NEW.raw_user_meta_data->>'address', ''),
        COALESCE(NEW.raw_user_meta_data->>'housing_sector', ''),
        'active',
        'public'
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.user_roles (user_id, role_key, assigned_by, is_active)
    VALUES (NEW.id, 'public_user', NULL, TRUE)
    ON CONFLICT (user_id, role_key) DO NOTHING;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.award_badge(
    p_user_id UUID,
    p_badge_key TEXT,
    p_source_module TEXT DEFAULT NULL,
    p_source_id UUID DEFAULT NULL,
    p_awarded_by UUID DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_badge_id UUID;
BEGIN
    SELECT id INTO v_badge_id
    FROM public.badges
    WHERE key = p_badge_key
      AND is_active = TRUE
      AND deleted_at IS NULL
    LIMIT 1;

    IF v_badge_id IS NULL THEN
        RAISE EXCEPTION 'Badge no existe o no está activo: %', p_badge_key;
    END IF;

    INSERT INTO public.user_badges (
        user_id,
        badge_id,
        source_module,
        source_id,
        awarded_by
    )
    VALUES (
        p_user_id,
        v_badge_id,
        p_source_module,
        p_source_id,
        p_awarded_by
    )
    ON CONFLICT DO NOTHING;
END;
$$;

-- ===========================================================
-- 15. VISTAS PÚBLICAS PARA FRONT NEXT.JS
-- ===========================================================

CREATE OR REPLACE VIEW public.v_landing_hero AS
SELECT
    ls.id,
    ls.title,
    ls.highlighted_text,
    ls.subtitle,
    ma.public_url AS main_image_url,
    ma.alt_text AS main_image_alt,
    COALESCE(
        json_agg(
            json_build_object(
                'id', hc.id,
                'title', hc.title,
                'description', hc.description,
                'icon', hc.icon,
                'ctaLabel', hc.cta_label,
                'ctaHref', hc.cta_href,
                'orderIndex', hc.order_index
            )
            ORDER BY hc.order_index
        ) FILTER (WHERE hc.id IS NOT NULL),
        '[]'::json
    ) AS cards
FROM public.landing_sections ls
LEFT JOIN public.media_assets ma ON ma.id = ls.main_media_id AND ma.deleted_at IS NULL
LEFT JOIN public.hero_cards hc ON hc.section_id = ls.id AND hc.is_active = TRUE AND hc.deleted_at IS NULL
WHERE ls.key = 'hero'
  AND ls.is_active = TRUE
  AND ls.deleted_at IS NULL
GROUP BY ls.id, ma.public_url, ma.alt_text;

CREATE OR REPLACE VIEW public.v_landing_impact AS
SELECT
    ls.id AS section_id,
    ls.title AS section_title,
    ls.subtitle AS section_subtitle,
    COALESCE(
        json_agg(
            json_build_object(
                'prefixText', lib.prefix_text,
                'metricValue', lib.metric_value,
                'suffixText', lib.suffix_text,
                'description', lib.description,
                'icon', lib.icon,
                'ctaLabel', lib.cta_label,
                'ctaHref', lib.cta_href,
                'orderIndex', lib.order_index
            )
            ORDER BY lib.order_index
        ) FILTER (WHERE lib.id IS NOT NULL),
        '[]'::json
    ) AS impact_blocks,
    COALESCE(
        (
            SELECT json_agg(
                json_build_object(
                    'title', lic.title,
                    'description', lic.description,
                    'icon', lic.icon,
                    'ctaLabel', lic.cta_label,
                    'ctaHref', lic.cta_href,
                    'orderIndex', lic.order_index
                )
                ORDER BY lic.order_index
            )
            FROM public.landing_info_cards lic
            WHERE lic.section_id = ls.id
              AND lic.is_active = TRUE
              AND lic.deleted_at IS NULL
        ),
        '[]'::json
    ) AS info_cards
FROM public.landing_sections ls
LEFT JOIN public.landing_impact_blocks lib
    ON lib.section_id = ls.id
   AND lib.is_active = TRUE
   AND lib.deleted_at IS NULL
WHERE ls.key = 'impact'
  AND ls.is_active = TRUE
  AND ls.deleted_at IS NULL
GROUP BY ls.id;

CREATE OR REPLACE VIEW public.v_about_featured_publications AS
SELECT
    p.id,
    p.title,
    p.slug,
    p.subtitle,
    p.description,
    p.cta_label,
    ma.public_url AS cover_image_url,
    ma.alt_text AS cover_image_alt,
    p.order_index,
    p.published_at
FROM public.publications p
LEFT JOIN public.media_assets ma ON ma.id = p.cover_media_id AND ma.deleted_at IS NULL
WHERE p.featured_section = 'about'
  AND p.is_featured = TRUE
  AND p.status = 'published'
  AND p.is_active = TRUE
  AND p.deleted_at IS NULL
ORDER BY p.order_index, p.published_at DESC
LIMIT 3;

CREATE OR REPLACE VIEW public.v_featured_campaigns AS
SELECT
    p.id,
    pc.name AS category_name,
    pc.slug AS category_slug,
    p.title,
    p.slug,
    p.subtitle,
    p.description,
    p.date_label,
    p.event_date,
    p.cta_label,
    ma.public_url AS cover_image_url,
    ma.alt_text AS cover_image_alt,
    p.order_index
FROM public.publications p
LEFT JOIN public.publication_categories pc ON pc.id = p.category_id
LEFT JOIN public.media_assets ma ON ma.id = p.cover_media_id AND ma.deleted_at IS NULL
WHERE p.featured_section = 'campaigns'
  AND p.is_featured = TRUE
  AND p.status = 'published'
  AND p.is_active = TRUE
  AND p.deleted_at IS NULL
ORDER BY p.order_index, p.event_date NULLS LAST;

CREATE OR REPLACE VIEW public.v_featured_animals AS
SELECT
    a.id,
    a.name,
    a.slug,
    a.species,
    a.sex,
    a.size,
    a.age_label,
    a.status,
    a.is_sterilized,
    a.description,
    img.public_url AS primary_image_url,
    img.alt_text AS primary_image_alt,
    a.order_index
FROM public.animal_profiles a
LEFT JOIN LATERAL (
    SELECT ma.public_url, ma.alt_text
    FROM public.animal_images ai
    JOIN public.media_assets ma ON ma.id = ai.media_id
    WHERE ai.animal_id = a.id
      AND ai.is_primary = TRUE
      AND ai.deleted_at IS NULL
      AND ma.deleted_at IS NULL
    LIMIT 1
) img ON TRUE
WHERE a.is_featured = TRUE
  AND a.is_active = TRUE
  AND a.status <> 'hidden'
  AND a.deleted_at IS NULL
ORDER BY a.order_index, a.created_at DESC;

CREATE OR REPLACE VIEW public.v_contact_info AS
SELECT
    id,
    whatsapp_number,
    phone_label,
    email,
    address,
    map_embed_url,
    google_maps_url
FROM public.contact_info
WHERE is_active = TRUE
  AND deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 1;

CREATE OR REPLACE VIEW public.v_faq_items AS
SELECT
    id,
    question,
    answer,
    category,
    order_index
FROM public.faq_items
WHERE is_active = TRUE
  AND deleted_at IS NULL
ORDER BY order_index, created_at;

-- ===========================================================
-- 16. RLS BASE SUPABASE
-- ===========================================================

DO $$
DECLARE
    t TEXT;
BEGIN
    FOREACH t IN ARRAY ARRAY[
        'avatar_options',
        'profiles',
        'roles',
        'permissions',
        'role_permissions',
        'user_roles',
        'badges',
        'user_badges',
        'media_assets',
        'landing_sections',
        'hero_cards',
        'landing_impact_blocks',
        'landing_info_cards',
        'publication_categories',
        'publications',
        'animal_profiles',
        'animal_images',
        'animal_characteristics',
        'housing_types',
        'adoption_applications',
        'adoption_status_history',
        'volunteer_requirements',
        'volunteer_applications',
        'volunteer_application_status_history',
        'volunteer_profiles',
        'terms_documents',
        'terms_acceptances',
        'user_notifications',
        'communication_logs',
        'contact_info',
        'social_links',
        'faq_items'
    ]
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    END LOOP;
END $$;

-- Limpieza de políticas si se vuelve a ejecutar en desarrollo.
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT schemaname, tablename, policyname
        FROM pg_policies
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- Lectura pública básica.
CREATE POLICY "Public can read active avatars"
ON public.avatar_options FOR SELECT
TO anon, authenticated
USING (is_active = TRUE AND deleted_at IS NULL);

CREATE POLICY "Public can read active badges"
ON public.badges FOR SELECT
TO anon, authenticated
USING (is_active = TRUE AND deleted_at IS NULL);

CREATE POLICY "Public can read media metadata"
ON public.media_assets FOR SELECT
TO anon, authenticated
USING (deleted_at IS NULL);

CREATE POLICY "Public can read active landing sections"
ON public.landing_sections FOR SELECT
TO anon, authenticated
USING (is_active = TRUE AND deleted_at IS NULL);

CREATE POLICY "Public can read active hero cards"
ON public.hero_cards FOR SELECT
TO anon, authenticated
USING (is_active = TRUE AND deleted_at IS NULL);

CREATE POLICY "Public can read active impact blocks"
ON public.landing_impact_blocks FOR SELECT
TO anon, authenticated
USING (is_active = TRUE AND deleted_at IS NULL);

CREATE POLICY "Public can read active info cards"
ON public.landing_info_cards FOR SELECT
TO anon, authenticated
USING (is_active = TRUE AND deleted_at IS NULL);

CREATE POLICY "Public can read active categories"
ON public.publication_categories FOR SELECT
TO anon, authenticated
USING (is_active = TRUE AND deleted_at IS NULL);

CREATE POLICY "Public can read published publications"
ON public.publications FOR SELECT
TO anon, authenticated
USING (status = 'published' AND is_active = TRUE AND deleted_at IS NULL);

CREATE POLICY "Public can read visible animals"
ON public.animal_profiles FOR SELECT
TO anon, authenticated
USING (is_active = TRUE AND status <> 'hidden' AND deleted_at IS NULL);

CREATE POLICY "Public can read animal images"
ON public.animal_images FOR SELECT
TO anon, authenticated
USING (
    deleted_at IS NULL
    AND EXISTS (
        SELECT 1 FROM public.animal_profiles a
        WHERE a.id = animal_images.animal_id
          AND a.is_active = TRUE
          AND a.status <> 'hidden'
          AND a.deleted_at IS NULL
    )
);

CREATE POLICY "Public can read active animal characteristics"
ON public.animal_characteristics FOR SELECT
TO anon, authenticated
USING (
    is_active = TRUE
    AND deleted_at IS NULL
    AND EXISTS (
        SELECT 1 FROM public.animal_profiles a
        WHERE a.id = animal_characteristics.animal_id
          AND a.is_active = TRUE
          AND a.status <> 'hidden'
          AND a.deleted_at IS NULL
    )
);

CREATE POLICY "Public can read contact info"
ON public.contact_info FOR SELECT
TO anon, authenticated
USING (is_active = TRUE AND deleted_at IS NULL);

CREATE POLICY "Public can read active social links"
ON public.social_links FOR SELECT
TO anon, authenticated
USING (is_active = TRUE AND deleted_at IS NULL);

CREATE POLICY "Public can read active faq"
ON public.faq_items FOR SELECT
TO anon, authenticated
USING (is_active = TRUE AND deleted_at IS NULL);

CREATE POLICY "Public can read active housing types"
ON public.housing_types FOR SELECT
TO anon, authenticated
USING (is_active = TRUE AND deleted_at IS NULL);

CREATE POLICY "Authenticated can read active terms"
ON public.terms_documents FOR SELECT
TO authenticated
USING (is_active = TRUE AND deleted_at IS NULL);

CREATE POLICY "Public can read active volunteer requirements"
ON public.volunteer_requirements FOR SELECT
TO anon, authenticated
USING (is_active = TRUE AND deleted_at IS NULL);

-- Perfil propio y gestión staff.
CREATE POLICY "Users can read own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "Staff can read profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (public.has_permission('users.read') OR public.has_permission('users.manage'));

CREATE POLICY "Admin can manage profiles"
ON public.profiles FOR UPDATE
TO authenticated
USING (public.has_permission('users.manage'))
WITH CHECK (public.has_permission('users.manage'));

-- Roles y permisos.
CREATE POLICY "Authenticated can read own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.has_permission('users.manage'));

CREATE POLICY "Admin can manage user roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_permission('users.manage'))
WITH CHECK (public.has_permission('users.manage'));

CREATE POLICY "Authenticated can read roles"
ON public.roles FOR SELECT
TO authenticated
USING (TRUE);

CREATE POLICY "Authenticated can read permissions"
ON public.permissions FOR SELECT
TO authenticated
USING (TRUE);

CREATE POLICY "Authenticated can read role permissions"
ON public.role_permissions FOR SELECT
TO authenticated
USING (TRUE);

-- Gestión de contenido general.
CREATE POLICY "Staff can manage media"
ON public.media_assets FOR ALL
TO authenticated
USING (
    public.has_permission('content.manage')
    OR public.has_permission('animals.manage')
    OR public.has_permission('settings.manage')
)
WITH CHECK (
    public.has_permission('content.manage')
    OR public.has_permission('animals.manage')
    OR public.has_permission('settings.manage')
);

CREATE POLICY "Staff can manage landing sections"
ON public.landing_sections FOR ALL
TO authenticated
USING (public.has_permission('content.manage'))
WITH CHECK (public.has_permission('content.manage'));

CREATE POLICY "Staff can manage hero cards"
ON public.hero_cards FOR ALL
TO authenticated
USING (public.has_permission('content.manage'))
WITH CHECK (public.has_permission('content.manage'));

CREATE POLICY "Staff can manage impact blocks"
ON public.landing_impact_blocks FOR ALL
TO authenticated
USING (public.has_permission('content.manage'))
WITH CHECK (public.has_permission('content.manage'));

CREATE POLICY "Staff can manage info cards"
ON public.landing_info_cards FOR ALL
TO authenticated
USING (public.has_permission('content.manage'))
WITH CHECK (public.has_permission('content.manage'));

CREATE POLICY "Staff can manage publication categories"
ON public.publication_categories FOR ALL
TO authenticated
USING (public.has_permission('content.manage'))
WITH CHECK (public.has_permission('content.manage'));

CREATE POLICY "Staff can manage publications"
ON public.publications FOR ALL
TO authenticated
USING (public.has_permission('content.manage'))
WITH CHECK (public.has_permission('content.manage'));

-- Gestión animales.
CREATE POLICY "Staff can manage animals"
ON public.animal_profiles FOR ALL
TO authenticated
USING (public.has_permission('animals.manage'))
WITH CHECK (public.has_permission('animals.manage'));

CREATE POLICY "Staff can manage animal images"
ON public.animal_images FOR ALL
TO authenticated
USING (public.has_permission('animals.manage'))
WITH CHECK (public.has_permission('animals.manage'));

CREATE POLICY "Staff can manage animal characteristics"
ON public.animal_characteristics FOR ALL
TO authenticated
USING (public.has_permission('animals.manage'))
WITH CHECK (public.has_permission('animals.manage'));

-- Solicitudes adopción.
CREATE POLICY "Users can create own adoption application"
ON public.adoption_applications FOR INSERT
TO authenticated
WITH CHECK (
    user_id = auth.uid()
    AND status = 'submitted'
    AND public.has_permission('adoption.apply')
);

CREATE POLICY "Users can read own adoption applications"
ON public.adoption_applications FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.has_permission('adoptions.manage'));

CREATE POLICY "Staff can manage adoption applications"
ON public.adoption_applications FOR UPDATE
TO authenticated
USING (public.has_permission('adoptions.manage'))
WITH CHECK (public.has_permission('adoptions.manage'));

CREATE POLICY "Users can read own adoption history"
ON public.adoption_status_history FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.adoption_applications aa
        WHERE aa.id = adoption_status_history.application_id
          AND aa.user_id = auth.uid()
    )
    OR public.has_permission('adoptions.manage')
);

CREATE POLICY "Staff can insert adoption history"
ON public.adoption_status_history FOR INSERT
TO authenticated
WITH CHECK (public.has_permission('adoptions.manage'));

-- Solicitudes voluntariado.
CREATE POLICY "Users can create own volunteer application"
ON public.volunteer_applications FOR INSERT
TO authenticated
WITH CHECK (
    user_id = auth.uid()
    AND status = 'submitted'
    AND public.has_permission('volunteer.apply')
);

CREATE POLICY "Users can read own volunteer applications"
ON public.volunteer_applications FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.has_permission('volunteers.manage'));

CREATE POLICY "Staff can manage volunteer applications"
ON public.volunteer_applications FOR UPDATE
TO authenticated
USING (public.has_permission('volunteers.manage'))
WITH CHECK (public.has_permission('volunteers.manage'));

CREATE POLICY "Users can read own volunteer history"
ON public.volunteer_application_status_history FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.volunteer_applications va
        WHERE va.id = volunteer_application_status_history.application_id
          AND va.user_id = auth.uid()
    )
    OR public.has_permission('volunteers.manage')
);

CREATE POLICY "Staff can insert volunteer history"
ON public.volunteer_application_status_history FOR INSERT
TO authenticated
WITH CHECK (public.has_permission('volunteers.manage'));

CREATE POLICY "Users can read own volunteer profile"
ON public.volunteer_profiles FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.has_permission('volunteers.manage'));

CREATE POLICY "Staff can manage volunteer profiles"
ON public.volunteer_profiles FOR ALL
TO authenticated
USING (public.has_permission('volunteers.manage'))
WITH CHECK (public.has_permission('volunteers.manage'));

-- Settings y catálogos.
CREATE POLICY "Staff can manage housing types"
ON public.housing_types FOR ALL
TO authenticated
USING (public.has_permission('settings.manage'))
WITH CHECK (public.has_permission('settings.manage'));

CREATE POLICY "Staff can manage volunteer requirements"
ON public.volunteer_requirements FOR ALL
TO authenticated
USING (public.has_permission('settings.manage') OR public.has_permission('volunteers.manage'))
WITH CHECK (public.has_permission('settings.manage') OR public.has_permission('volunteers.manage'));

CREATE POLICY "Staff can manage terms"
ON public.terms_documents FOR ALL
TO authenticated
USING (public.has_permission('settings.manage'))
WITH CHECK (public.has_permission('settings.manage'));

CREATE POLICY "Users can accept terms"
ON public.terms_acceptances FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read own terms acceptances"
ON public.terms_acceptances FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.has_permission('settings.manage'));

CREATE POLICY "Staff can manage contact"
ON public.contact_info FOR ALL
TO authenticated
USING (public.has_permission('settings.manage'))
WITH CHECK (public.has_permission('settings.manage'));

CREATE POLICY "Staff can manage social links"
ON public.social_links FOR ALL
TO authenticated
USING (public.has_permission('settings.manage'))
WITH CHECK (public.has_permission('settings.manage'));

CREATE POLICY "Staff can manage faq"
ON public.faq_items FOR ALL
TO authenticated
USING (public.has_permission('settings.manage') OR public.has_permission('content.manage'))
WITH CHECK (public.has_permission('settings.manage') OR public.has_permission('content.manage'));

-- Badges, notificaciones y comunicaciones.
CREATE POLICY "Users can read own badges"
ON public.user_badges FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.has_permission('users.read'));

CREATE POLICY "Staff can manage user badges"
ON public.user_badges FOR ALL
TO authenticated
USING (public.has_permission('users.manage'))
WITH CHECK (public.has_permission('users.manage'));

CREATE POLICY "Users can read own notifications"
ON public.user_notifications FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can mark own notifications as read"
ON public.user_notifications FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Staff can create notifications"
ON public.user_notifications FOR INSERT
TO authenticated
WITH CHECK (public.has_permission('communications.manage'));

CREATE POLICY "Users can read own communication logs"
ON public.communication_logs FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.has_permission('communications.manage'));

CREATE POLICY "Staff can manage communication logs"
ON public.communication_logs FOR ALL
TO authenticated
USING (public.has_permission('communications.manage'))
WITH CHECK (public.has_permission('communications.manage'));

-- ===========================================================
-- FIN DEL SCRIPT V1
-- ===========================================================
