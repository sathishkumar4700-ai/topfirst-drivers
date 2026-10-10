from app.schemas.news import NewsArticle
from app.services.dedupe import cluster_articles, similarity


def test_similarity_detects_near_duplicates():
    assert similarity("Chennai rain alert today", "Chennai rain alert issued today") > 0.5


def test_cluster_merges_duplicates():
    a = NewsArticle(
        headline="TN CM visit to Coimbatore",
        summary="Visit",
        url="u1",
        source_name="A",
    )
    b = NewsArticle(
        headline="TN CM visit to Coimbatore district",
        summary="Visit details",
        url="u2",
        source_name="B",
    )
    clusters = cluster_articles([a, b])
    assert len(clusters) == 1
    assert len(clusters[0]) == 2
