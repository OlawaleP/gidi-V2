import Link from 'next/link';
import { Container } from '@/components/common/Container';
import { ProductCategory } from '@/types/product';
import { CATEGORY_LABELS } from '@/lib/constants';
import { getCategoryIcon } from '@/lib/utils';
import { CategoryIcon } from '../organisms/CategoryIcon';

interface CategoriesSectionProps {
  className?: string;
}

export function CategoriesSection({ className }: CategoriesSectionProps) {
  const categories = Object.entries(CATEGORY_LABELS).map(([key, label]) => ({
    key: key as ProductCategory,
    label,
    href: `/products?category=${key}`,
    iconConfig: getCategoryIcon(key as ProductCategory),
  }));

  return (
    <section className={`py-16 lg:py-24 ${className}`}>
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore our diverse range of products organized by category
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.key}
              href={category.href}
              className="group p-6 bg-white dark:bg-gray-800 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 text-center border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-700"
            >
              <div className="w-12 h-12 mx-auto mb-4 text-primary-600 group-hover:text-primary-700 transition-colors">
                <CategoryIcon config={category.iconConfig} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
                {category.label}
              </h3>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}